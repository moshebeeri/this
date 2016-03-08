'use strict';

var _ = require('lodash');
var Location = require('./location.model');
var logger = require('../../components/logger').createLogger();
var spatial = require('../../components/spatial').createSpatial();
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('location');


// Get list of locations
exports.index = function(req, res) {
  Location.find(function (err, locations) {
    if(err) { return handleError(res, err); }
    return res.json(200, locations);
  });
};

// Get a single location
exports.show = function(req, res) {
  Location.findById(req.params.id, function (err, location) {
    if(err) { return handleError(res, err); }
    if(!location) { return res.send(404); }
    return res.json(location);
  });
};

// Creates a new location in the DB.
exports.create = function(req, res) {
  var userId = req.user._id;
  Location.create(req.body, function(err, location) {
    if(err) { return handleError(res, err); }
    req.body.locations.forEach(function(location){
      graphModel.save({
        lat: location.lat,
        lng: location.lng,
        speed: location.speed,
        userId: userId
      }, function(err, location){
        spatial.add2index(location.id, function(err, result){
          if(err) logger.error(err.message);
          else logger.info('object added to layer ' + result)
        });
      });
    });
    return res.json(201, location);
  });
};

// Updates an existing location in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Location.findById(req.params.id, function (err, location) {
    if (err) { return handleError(res, err); }
    if(!location) { return res.send(404); }
    var updated = _.merge(location, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, location);
    });
  });
};

// Deletes a location from the DB.
exports.destroy = function(req, res) {
  Location.findById(req.params.id, function (err, location) {
    if(err) { return handleError(res, err); }
    if(!location) { return res.send(404); }
    location.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
