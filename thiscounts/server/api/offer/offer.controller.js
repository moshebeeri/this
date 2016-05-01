'use strict';

var _ = require('lodash');
var Offer = require('./offer.model.js');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('offer');

// Get list of offers
exports.index = function(req, res) {
  Offer.find(function (err, offers) {
    if(err) { return handleError(res, err); }
    return res.json(200, offers);
  });
};

// Get a single offer
exports.show = function(req, res) {
  Offer.findById(req.params.id, function (err, offer) {
    if(err) { return handleError(res, err); }
    if(!offer) { return res.send(404); }
    return res.json(offer);
  });
};

// Creates a new offer in the DB.
exports.create = function(req, res) {
  Offer.create(req.body, function(err, offer) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(offer, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.json(201, offer);
  });
};

// Updates an existing offer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Offer.findById(req.params.id, function (err, offer) {
    if (err) { return handleError(res, err); }
    if(!offer) { return res.send(404); }
    var updated = _.merge(offer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, offer);
    });
  });
};

// Deletes a offer from the DB.
exports.destroy = function(req, res) {
  Offer.findById(req.params.id, function (err, offer) {
    if(err) { return handleError(res, err); }
    if(!offer) { return res.send(404); }
    offer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
