'use strict';

let _ = require('lodash');
let Explore = require('./explore.model');

// Get list of explores
exports.index = function(req, res) {
  Explore.find(function (err, explores) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(explores);
  });
};

// Get a single explore
exports.show = function(req, res) {
  Explore.findById(req.params.id, function (err, explore) {
    if(err) { return handleError(res, err); }
    if(!explore) { return res.status(404).send('Not Found'); }
    return res.json(explore);
  });
};

// Creates a new explore in the DB.
exports.create = function(req, res) {
  Explore.create(req.body, function(err, explore) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(explore);
  });
};

// Updates an existing explore in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Explore.findById(req.params.id, function (err, explore) {
    if (err) { return handleError(res, err); }
    if(!explore) { return res.status(404).send('Not Found'); }
    let updated = _.merge(explore, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(explore);
    });
  });
};

// Deletes a explore from the DB.
exports.destroy = function(req, res) {
  Explore.findById(req.params.id, function (err, explore) {
    if(err) { return handleError(res, err); }
    if(!explore) { return res.status(404).send('Not Found'); }
    explore.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
