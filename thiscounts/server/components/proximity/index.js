'use strict';

const _ = require('lodash');
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const spatial = require('../spatial').createSpatial();

const graphModel = require('../graph-tools').createGraphModel('promotion');
const Promotion = require('../../api/promotion/promotion.model');
const Instance = require('../instance');
const activity = require('../activity').createActivity();
const Notifications = require('../notification');
const async = require('async');

let ProximitySchema = new Schema({
  _id: {type: Schema.ObjectId, ref: 'User', require: true, index: true},
  last_report: {type: Schema.ObjectId, ref: 'Location'},
  //see https://docs.mongodb.org/manual/reference/geojson/#geospatial-indexes-store-geojson
  //{ type: "Point", coordinates: [ 40, 5 ] },
  //Always list coordinates in longitude, latitude order.
  location: {
    lng: Number,
    lat: Number,
    type: {type: String},
    coordinates: []
  },
  reported: {type: Date, default: Date.now(), require: true, index: true}
});

ProximitySchema.index({location: '2dsphere'});
let ProximityModel = mongoose.model('Proximity', ProximitySchema);

function Proximity() {
}

function createReport(userId, location, callback) {
  let proximity = {
    _id: userId,
    location: spatial.geo_to_location(location)
  };
  //console.log(JSON.stringify(proximity, null, 2));
  ProximityModel.create(proximity, function (err, proximity) {
    if (err) return callback(err);
    return callback(null, proximity);
  });
}
/**   Working example
*     MATCH (p:promotion)<-[on:ON_ACTION]-(entity)<-[:FOLLOW]-(u:user{_id:'59a412c7f7956ee14eca6d41'})
*     WITH on,entity, {longitude:34.785981,latitude:32.090955} AS coordinate
*     CALL spatial.withinDistance('world', coordinate, on.proximity) YIELD node AS p
*     WITH p._id as _id, 34.785981 as lon, 32.090955 as lat, p.lat as p_lat, p.lon as p_lon, entity
*     WHERE _id IS NOT NULL AND on.type = 'PROXIMITY'
*     RETURN _id, 2 * 6371 * asin(sqrt(haversin(radians(lat - p_lat))+ cos(radians(lat))* cos(radians(p_lat))* haversin(radians(lon - p_lon)))) as d,
*             entity._id as entity, labels(entity) as labels
*     ORDER BY d ASC
*     skip 0 limit 20
* */
function handleProximityActions(userId, location, callback) {
  let skip = 0;
  let limit = 20;
  let coordinate = spatial.location_to_special(location);
  const query = ` MATCH (promo:promotion)<-[on:ON_ACTION]-(entity)<-[:FOLLOW]-(u:user{_id:'${userId}'})
                  WHERE  promo._id IS NOT NULL AND on.type = 'PROXIMITY'
                  WITH   entity,promo,u,on, {longitude:${coordinate.longitude},latitude:${coordinate.latitude}} AS coordinate
                  CALL spatial.withinDistance('world', coordinate, on.proximity) YIELD node AS p
                  WITH   promo, entity
                  RETURN distinct promo, entity, labels(entity) as labels
                  ORDER BY (2 * 6371 * asin(sqrt(haversin(radians(promo.lat - entity.lat))+ cos(radians(promo.lat))*cos(radians(entity.lat))*haversin(radians(promo.lon - entity.lat))))) desc
                  SKIP ${skip} LIMIT ${limit}`;

  console.log('handleProximityActions: ' + query);
  graphModel.query(query, function (err, eligibilities) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, eligibilities);
  });
}

function entityRoleMembers(entity, callback) {
  let query = `MATCH (entity{_id:'${entity}'})<-[role:ROLE]-(u:user) return distinct u._id as _id`;
  console.log(`entityRoleMembers query: ${query}`);
  graphModel.query(query, function(err, users){
    if(err) return callback(err);
    users = users.map(user => user._id);
    return callback(null, users);
  })
}

function proximityEligibility(userId, location, eligible, callback) {
  Promotion.findById(eligible.promo._id, function (err, promotion) {
    if (err) return callback(err);
    if (!promotion) return callback(new Error('promotion not found for _id:' + eligible.promo._id));
    Instance.createSingleInstance(promotion, function (err, instance) {
      activity.activity({
        instance: instance._id,
        promotion: instance.promotion._id,
        ids: [userId],
        action: "eligible_by_proximity",
        location: location
      });
      Instance.notify(instance._id, [userId]);
      entityRoleMembers(eligible.entity._id, function (err, userIds) {
        if (err) {
          console.error(err);
          callback(err);
        }
        if (!userIds) {
          console.error(new Error(`Not Entity role found`));
          callback(null);
        }
        Notifications.notify({
          note: 'ELIGIBLE_BY_PROXIMITY',
          instance: instance._id
        }, userIds)
      })

    });
  })
}

exports.reportLastLocation = function(userId, location, callback) {
  ProximityModel.findById(userId, function (err, proximity) {
    if (err) return callback(err);
    if (!proximity)
      return createReport(userId, location, callback);
    proximity.location = spatial.geo_to_location(location);
    proximity.save(function (err) {
      if (err) return callback(err);
      return callback(null, proximity);
    });
  });

  // function eligibilityCallback(err, info) {
  //   if (err) return console.error(err);
  // }
  handleProximityActions(userId, location, function (err, eligibilities) {
    if(err) return console.log('error calling handleProximityActions');
    if(!eligibilities)
      return console.log('no eligibilities found');
    //console.log(JSON.stringify(eligibilities));

    async.each(eligibilities, function(eligible, callback) {
      proximityEligibility(userId, location, eligible, callback);
    }, function(err) {
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        console.log('handleProximityActions - one of the eligible failed to process with the following error:');
        console.error(err);
      }
      //const entitiesUniqueIds = [...new Set( eligibilities.map(eligible => eligible.entity)) ];

    });
  });
};
