'use strict';

let _ = require('lodash');
let Merchant = require('./merchant.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('mall');

// Get list of merchants
exports.index = function(req, res) {
  Merchant.find(function (err, merchants) {
    if(err) { return handleError(res, err); }
    return res.json(200, merchants);
  });
};

// Get a single merchant
exports.show = function(req, res) {
  Merchant.findById(req.params.id, function (err, merchant) {
    if(err) { return handleError(res, err); }
    if(!merchant) { return res.send(404); }
    return res.json(merchant);
  });
};

// Creates a new merchant in the DB.
exports.create = function(req, res) {
  Merchant.create(req.body, function(err, merchant) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(merchant, {_id: merchant._id}, function (err) {
      if (err) { return handleError(res, err); }
    });
    return res.json(201, merchant);
  });
};

// Updates an existing merchant in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Merchant.findById(req.params.id, function (err, merchant) {
    if (err) { return handleError(res, err); }
    if(!merchant) { return res.send(404); }
    let updated = _.merge(merchant, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, merchant);
    });
  });
};

// Deletes a merchant from the DB.
exports.destroy = function(req, res) {
  Merchant.findById(req.params.id, function (err, merchant) {
    if(err) { return handleError(res, err); }
    if(!merchant) { return res.send(404); }
    merchant.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
