'use strict';

let _ = require('lodash');
let Realize = require('./realize.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('realize');

// Get list of realizes
exports.index = function(req, res) {
  Realize.find(function (err, realizes) {
    if(err) { return handleError(res, err); }
    return res.json(200, realizes);
  });
};

// Get a single realize
exports.show = function(req, res) {
  Realize.findById(req.params.id, function (err, realize) {
    if(err) { return handleError(res, err); }
    if(!realize) { return res.send(404); }
    return res.json(realize);
  });
};

// Creates a new realize in the DB.
exports.create = function(req, res) {
  Realize.create(req.body, function(err, realize) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(realize, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.json(201, realize);
  });
};

// Updates an existing realize in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Realize.findById(req.params.id, function (err, realize) {
    if (err) { return handleError(res, err); }
    if(!realize) { return res.send(404); }
    let updated = _.merge(realize, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, realize);
    });
  });
};

// Deletes a realize from the DB.
exports.destroy = function(req, res) {
  Realize.findById(req.params.id, function (err, realize) {
    if(err) { return handleError(res, err); }
    if(!realize) { return res.send(404); }
    realize.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
