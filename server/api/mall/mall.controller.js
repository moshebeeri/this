'use strict';

var _ = require('lodash');
var Mall = require('./mall.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('mall');

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
  var bmall = req.body;
  location.address_location( bmall, function(err, data) {
    if (err) return res.status(401).send(err.message);
    bmall.location = {
      lat: data.lat,
      lon: data.lon
    };
    Mall.create(bmall, function(err, mall) {
      if(err) { return handleError(res, err); }
      graphModel.reflect(mall, function (err) {
        if (err) {  return handleError(res, err); }
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
    var updated = _.merge(mall, req.body);
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
