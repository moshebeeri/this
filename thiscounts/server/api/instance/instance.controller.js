'use strict';

var _ = require('lodash');
var Instance = require('./instance.model.js');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('instance');

// Get list of instances
exports.index = function(req, res) {
  Instance.find(function (err, instances) {
    if(err) { return handleError(res, err); }
    return res.json(200, instances);
  });
};

// Get a single instance
exports.show = function(req, res) {
  Instance.findById(req.params.id, function (err, instance) {
    if(err) { return handleError(res, err); }
    if(!instance) { return res.send(404); }
    return res.json(instance);
  });
};

// Creates a new instance in the DB.
exports.create = function(req, res) {
  Instance.create(req.body, function(err, instance) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(instance, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.json(201, instance);
  });
};

// Updates an existing instance in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Instance.findById(req.params.id, function (err, instance) {
    if (err) { return handleError(res, err); }
    if(!instance) { return res.send(404); }
    var updated = _.merge(instance, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, instance);
    });
  });
};

// Deletes a instance from the DB.
exports.destroy = function(req, res) {
  Instance.findById(req.params.id, function (err, instance) {
    if(err) { return handleError(res, err); }
    if(!instance) { return res.send(404); }
    instance.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
