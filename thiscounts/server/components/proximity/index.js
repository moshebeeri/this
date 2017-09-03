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
    coordinates: []
  },
  reported: {type: Date, default: Date.now(), require: true, index: true}
});

ProximitySchema.index({location: '2dsphere'});
let ProximityModel = mongoose.model('Proximity', ProximitySchema);

function Proximity() {
}

function createReport(userId, location, callback) {
  ProximityModel.create({
    _id: userId,
    last_location: spatial.geo_to_location(location)
  }, function (err, proximity) {
    if (err) return callback(err);
    return callback(null, proximity);
  });
}

function handleProximityActions(userId, location, callback) {
  let skip = 0;
  let limit = 20;
  let coordinate = spatial.location_to_special(location);
  let query = `WITH {longitude:${coordinate.longitude},latitude:${coordinate.latitude}} AS coordinate
    CALL spatial.withinDistance('world', coordinate, on.proximity) YIELD node AS p
    MATCH (p:promotion)<-[on:ON_ACTION]-(entity)-[:FOLLOW]-(u:user{_id:'${userId}'})
    with p._id as _id, ${coordinate.longitude} as lon, ${coordinate.latitude} as lat, p.lat as p_lat, p.lon as p_lon
    where _id IS NOT NULL AND 
    return _id, 2 * 6371 * asin(sqrt(haversin(radians(lat - p_lat))+ cos(radians(lat))* cos(radians(p_lat))* haversin(radians(lon - p_lon)))) as d,
            entity._id as entity, type(entity) as type
    ORDER BY d ASC
    skip ${skip} limit ${limit}
  `;
  console.log(query);
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
    eligibles.forEach(eligible => {
      proximityEligibility(userId, location, eligible, eligibilityCallback);
    })
  });
};
