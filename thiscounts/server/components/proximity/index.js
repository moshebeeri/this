'use strict';

const _ = require('lodash');
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const spatial = require('../spatial').createSpatial();

const graphModel = require('../graph-tools').createGraphModel('promotion');
const Promotion = require('../../api/promotion/promotion.model');
const Instance = require('../instance');
const activity = require('../activity');
const Notifications = require('../notification');

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
  let query = ` MATCH (p:promotion)<-[on:ON_ACTION]-(entity)<-[:FOLLOW]-(u:user{_id:'${userId}'})
                WITH on, entity, {longitude:${coordinate.longitude},latitude:${coordinate.latitude}} AS coordinate
                CALL spatial.withinDistance('world', coordinate, on.proximity) YIELD node AS p
                WITH p._id as _id, ${coordinate.longitude} as lon, ${coordinate.latitude} as lat, p.lat as p_lat, p.lon as p_lon, entity
                WHERE _id IS NOT NULL AND on.type = 'PROXIMITY'
                RETURN _id, 2 * 6371 * asin(sqrt(haversin(radians(lat - p_lat))+ cos(radians(lat))* cos(radians(p_lat))* haversin(radians(lon - p_lon)))) as d,
                        entity._id as entity, labels(entity) as labels
                ORDER BY d ASC
                skip ${skip} limit ${limit}`;
  //console.log(query);
  graphModel.query(query, function (err, eligibles) {
    if (err) return callback(err);
    return callback(null, eligibles);
  });
}

function entityRoleMembers(entity, callback) {
  let query = `MATCH (entity{_id:'${entity}'}<-[role:ROLE]-(u:user) return u._id as users`;
  graphModel.query(query, function(err, users){
    if(err) return callback(err);
    return callback(null, users);
  })
}

function proximityEligibility(userId, location, eligible, callback) {
  console.log(`proximityEligibility userId ${userId}, location ${JSON.stringify(location)}, eligible ${JSON.stringify(eligible)}`);
  Promotion.findbyId(eligible._id, function (err, promotion) {
    if (err) return callback(err);
    if (!promotion) return callback(new Error('promotion not found for _id:' + eligible._id));
    Instance.createSingleInstance(promotion, function (err, instance) {
      activity.activity({
        instance: instance._id,
        promotion: instance.promotion._id,
        ids: [userId],
        action: "eligible_by_proximity",
        location: location
      });
      entityRoleMembers(eligible.entity, function(err, userIds) {
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

  function eligibilityCallback(err, info) {
    if (err) return console.error(err);
  }

  handleProximityActions(userId, location, function (err, eligibles) {
    if(err) return console.log('error calling handleProximityActions');
    if(!eligibles)
      return console.log('no eligibles found');
    eligibles.forEach(eligible => {
      proximityEligibility(userId, location, eligible, eligibilityCallback);
    })
  });
};
