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

function coordinatesDistance(point1, point2) {
  const lat1 = point1.lat;
  const lon1 = point1.lon;
  const lat2 = point2.lat;
  const lon2 = point2.lon;
  const R = 6371e3; // metres
  const phi1 = lat1.toRadians();
  const phi2 = lat2.toRadians();
  const deltaPhi = (lat2-lat1).toRadians();
  const deltaGamma = (lon2-lon1).toRadians();
  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaGamma/2) * Math.sin(deltaGamma/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d;
}

// The distance calculation was verify against the site in the url,
// distance return in km.
//https://www.movable-type.co.uk/scripts/latlong.html
//WITH 46.9163 AS lat1, -114.09 AS lon1, 46.9163 AS lat2, -114.1 AS lon2
//RETURN 2 * 6371 * asin(sqrt(haversin(radians(lat1 - lat2))+ cos(radians(lat1))* cos(radians(lat2))* haversin(radians(lon1 - lon2))))

function handleFollowersProximityActions(userId, location, callback) {
  let skip = 0;
  let limit = 20;
  let coordinate = spatial.location_to_special(location);
  const query = ` MATCH (promo:promotion)<-[on:ON_ACTION]-(entity)<-[f:FOLLOW]-(u:user{_id:'${userId}'})
                  WITH   entity,promo,u,on, 
                          point({longitude:${coordinate.longitude},latitude:${coordinate.latitude}}) AS coordinate,
                          point({longitude:promo.lon,latitude:promo.lat}) AS promoLocation
                  WHERE   NOT (u)-[:ON_ACTION_SENT]->(promo)
                          AND promo._id IS NOT NULL AND on.type = 'FOLLOWER_PROXIMITY'
                  			  AND ( NOT exists(f.eligible_by_proximity_time) OR f.eligible_by_proximity_time + 1000*60*60*24*14 > timestamp()) 
                  			  AND distance(coordinate, promoLocation) < on.proximity*1000
         
                  WITH   promo, entity, coordinate, promoLocation
                  RETURN distinct promo, entity, labels(entity) as labels, distance(coordinate, promoLocation) as d
                  ORDER BY d desc
                  SKIP ${skip} LIMIT ${limit}`;

  graphModel.query(query, function (err, eligibilities) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, eligibilities);
  });
}

function handleProximityActions(userId, location, callback) {
  let skip = 0;
  let limit = 20;
  let coordinate = spatial.location_to_special(location);
  const query = ` MATCH (promo:promotion)<-[on:ON_ACTION]-(entity),(u:user{_id:'${userId}'})  
                  WITH   entity,promo,on, 
                          point({longitude:${coordinate.longitude},latitude:${coordinate.latitude}}) AS coordinate,
                          point({longitude:promo.lon,latitude:promo.lat}) AS promoLocation                  
                  WHERE NOT (u)-[:ON_ACTION_SENT]->(promo)
                        AND promo._id IS NOT NULL AND on.type = 'PROXIMITY'
                  			AND distance(coordinate, promoLocation) < on.proximity*1000
                        AND NOT (entity)<-[:FOLLOW]-(u)
                        AND NOT (entity)<-[:NO_ON_PROXIMITY_ACTION]-(u)
                  WITH   promo, entity, coordinate, promoLocation
                  RETURN distinct promo, entity, labels(entity) as labels, distance(coordinate, promoLocation) as d
                  ORDER BY d desc
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
  graphModel.query(query, function(err, users){
    if(err) return callback(err);
    users = users.map(user => user._id);
    return callback(null, users);
  })
}

function proximityEligibility(userId, location, eligible, isFollower, callback) {
  Promotion.findById(eligible.promo._id, function (err, promotion) {
    if (err) return callback(err);
    if (!promotion) return callback(new Error('promotion not found for _id:' + eligible.promo._id));
    const action = isFollower? 'follower_eligible_by_proximity' : 'eligible_by_proximity';
    Instance.createSingleInstance(promotion, function (err, instance) {
      activity.activity({
        instance: instance._id,
        promotion: instance.promotion._id,
        ids: [userId],
        action: action,
        location: location
      });

      graphModel.relate_ids(userId, 'ON_ACTION_SENT', eligible.promo._id,  `{time: timestamp(), action: '${action}'`);

      Instance.notify(instance, [userId]);
      //Notify new costumer received eligible by proximity
      if(!isFollower) {
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
      }
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
  handleFollowersProximityActions(userId, location, function (err, eligibilities) {
    if(err) return console.log('error calling handleFollowersProximityActions');
    if(!eligibilities)
      return console.log('no eligibilities found');
    //console.log(JSON.stringify(eligibilities));

    async.each(eligibilities, function(eligible, callback) {
      proximityEligibility(userId, location, eligible, callback);
    }, function(err) {
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        console.log('handleFollowersProximityActions - one of the eligible failed to process with the following error:');
        console.error(err);
      }
      //const entitiesUniqueIds = [...new Set( eligibilities.map(eligible => eligible.entity)) ];
    });
  });

  handleProximityActions(userId, location, function (err, eligibilities) {
    if(err) return console.log('error calling handleFollowersProximityActions');
    if(!eligibilities)
      return console.log('no eligibilities found');
    async.each(eligibilities, function(eligible, callback) {
      proximityEligibility(userId, location, eligible, callback);
    }, function(err) {
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        console.log('handleFollowersProximityActions - one of the eligible failed to process with the following error:');
        console.error(err);
      }
      //const entitiesUniqueIds = [...new Set( eligibilities.map(eligible => eligible.entity)) ];
    });
  });

};

exports.businessesWithinDistance = function(userId, distanceInMeters, callback){
  if(!distanceInMeters) distanceInMeters = 10000;
  console.log(`businessesWithinDistance`);

  ProximityModel.findById(userId, function (err, proximity) {
    if (err) return console.error(err);
    if (!proximity) return console.log(`no proximity for user ${userId}`);
    if (!proximity.location) return console.log(`no proximity.location for user ${userId}`);

    let coordinate = spatial.location_to_special(proximity.location);

    const query = ` MATCH (b:business),(u:user{_id:'${userId}'})  
                    WITH  b,u,
                          point({longitude:${coordinate.longitude},latitude:${coordinate.latitude}}) AS coordinate,
                          point({longitude:b.lon,latitude:b.lat}) AS businessLocation                  
                    WHERE NOT (u)-[:FOLLOW]->(b)
                          AND distance(coordinate, businessLocation) < ${distanceInMeters}
                    WITH   b, coordinate, businessLocation
                    RETURN distinct b._id as business, distance(coordinate, businessLocation) as d
                    ORDER BY d desc
                    SKIP 0 LIMIT 10`;
    console.log(`exports.businessesWithinDistance q=${query}`);
    graphModel.query(query, function (err, businesses) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      console.log(`businessesWithinDistance ${JSON.stringify(businesses)}`);
      return callback(null, businesses);
    });
  });
};
