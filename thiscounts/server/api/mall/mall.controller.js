'use strict';

let _ = require('lodash');
let Mall = require('./mall.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('mall');
let spatial = require('../../components/spatial').createSpatial();
let location = require('../../components/location').createLocation();
let logger = require('../../components/logger').createLogger();

// Get list of malls
exports.index = function(req, res) {
  Mall.find(function (err, malls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(malls);
  });
};

// Get a single mall
exports.show = function(req, res) {
  Mall.findById(req.params.id, function (err, mall) {
    if(err) { return handleError(res, err); }
    if(!mall) { return res.status(404).send('Not Found'); }
    return res.json(mall);
  });
};

// Creates a new mall in the DB.
exports.create = function(req, res) {
  let mall = req.body;
  location.address_location( mall, function(err, data) {
    if (err) {
      if (err.code >= 400) return res.status(err.code).send(err.message);
      else if (err.code == 202) return res.status(202).json(data)
    }
    mall.location = spatial.geo_to_location(data);
    Mall.create(mall, function(err, mall) {
      if(err) { return handleError(res, err); }
      graphModel.reflect(mall, {
        _id: mall._id,
        name: mall.name,
        lat: mall.location.lat,
        lon: mall.location.lng
      }, function (err) {
        if (err) {  return handleError(res, err); }
        spatial.add2index(mall.gid, function(err, result){
          if(err) logger.error(err.message);
          else logger.info('object added to layer ' + result)
        });

      });
      return res.status(201).json(mall);
    });
  });
};

// Updates an existing mall in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Mall.findById(req.params.id, function (err, mall) {
    if (err) { return handleError(res, err); }
    if(!mall) { return res.status(404).send('Not Found'); }
    let updated = _.merge(mall, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(mall);
    });
  });
};

// Deletes a mall from the DB.
exports.destroy = function(req, res) {
  Mall.findById(req.params.id, function (err, mall) {
    if(err) { return handleError(res, err); }
    if(!mall) { return res.status(404).send('Not Found'); }
    mall.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
