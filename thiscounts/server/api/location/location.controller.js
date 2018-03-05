'use strict';
const _ = require('lodash');
const Location = require('./location.model');
const logger = require('../../components/logger').createLogger();
const spatial = require('../../components/spatial').createSpatial();
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('location');
const proximity = require('../../components/proximity');
// Get list of locations
exports.index = function (req, res) {
  Location.find(function (err, locations) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(locations);
  });
};
// Get a single location
exports.show = function (req, res) {
  Location.findById(req.params.id, function (err, location) {
    if (err) {
      return handleError(res, err);
    }
    if (!location) {
      return res.send(404);
    }
    return res.status(201).json(location);
  });
};
// Creates a new location in the DB.
exports.simulate = function (req, res) {
  function toRad(coordinate) {
    return coordinate * Math.PI / 180;
  }

  function getBoundingBox(pLatitude, pLongitude, pDistanceInMeters) {
    const latRadian = toRad(pLatitude);
    const degLatKm = 110.574235;
    const degLongKm = 110.572833 * Math.cos(latRadian);
    const deltaLat = pDistanceInMeters / 1000.0 / degLatKm;
    const deltaLong = pDistanceInMeters / 1000.0 / degLongKm;
    const topLat = pLatitude + deltaLat;
    const leftLng = pLongitude - deltaLong;
    // const bottomLat = pLatitude - deltaLat;
    // const rightLng = pLongitude + deltaLong;
    //const northWestCoords = topLat + ',' + leftLng;
    // const northEastCoords = topLat + ',' + rightLng;
    // const southWestCoords = bottomLat + ',' + leftLng;
    // const southEastCoords = bottomLat + ',' + rightLng;
    // const boundingBox = [northWestCoords, northEastCoords, southWestCoords, southEastCoords];
    // return boundingBox;
    return {
      lat: topLat,
      lon: leftLng,
    }
  }

  console.log(`req.params.lat ${req.params.lat}, req.params.lng ${req.params.lng}, req.params.distance ${req.params.distance}`)
  const location = getBoundingBox(parseFloat(req.params.lat),
    parseFloat(req.params.lng),
    parseFloat(req.params.distance));
  const deletePrevQuery = `match (l:location{userId:'${req.user._id}'})-[r]-() delete l,r`;
  graphModel.query(deletePrevQuery, (err) => {
    if (err) {return handleError(res, err)}
    graphModel.save({
      lat: location.lat,
      lon: location.lng,
      speed: 0,
      time: new Date(),
      userId: req.user._id
    }, function (err, location) {
      spatial.add2index(location.id, function (err, result) {
        if (err) return handleError(res, err);
        //else logger.info('object added to layer ' + result)
        proximity.reportLastLocation(location.userId, location, function (err) {
          if (err) return handleError(res, err);
          res.status(200).json(location);
        });
      });
    });
  });
};

exports.create = function (req, res) {
  let userId = req.body.userId = req.user._id;
  let locations = req.body.locations;
  if (locations.length === 0)
    return res.status(404).send('locations list is empty');

  const deletePrevQuery = `match (l:location{userId:'${userId}'})-[r]-() delete l,r`;
  graphModel.query(deletePrevQuery, (err) => {
    if (err) { return handleError(res,err) }
    Location.create(req.body, function (err, location) {
      if (err) {return handleError(res, err)}
      locations.forEach(function (location) {
        graphModel.save({
          lat: location.lat,
          lon: location.lng,
          speed: location.speed,
          time: new Date(),
          userId: userId
        }, function (err, location) {
          spatial.add2index(location.id, function (err, result) {
            if (err) return logger.error(err.message);
            //else logger.info('object added to layer ' + result)
          });
        });
      });
      proximity.reportLastLocation(userId, locations[locations.length - 1], function (err) {
        if (err) console.error(err);
      });
      return res.status(201).json(location);
    });
  })
};
// Updates an existing location in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Location.findById(req.params.id, function (err, location) {
    if (err) {
      return handleError(res, err);
    }
    if (!location) {
      return res.send(404);
    }
    let updated = _.merge(location, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(201).json(location);
    });
  });
};
// Deletes a location from the DB.
exports.destroy = function (req, res) {
  Location.findById(req.params.id, function (err, location) {
    if (err) {
      return handleError(res, err);
    }
    if (!location) {
      return res.send(404);
    }
    location.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
