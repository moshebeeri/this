'use strict';

var _ = require('lodash');
var CardType = require('./cardType.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('cardType');

// Get list of cardTypes
exports.index = function(req, res) {
  CardType.find(function (err, cardTypes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(cardTypes);
  });
};

// Get a single cardType
exports.show = function(req, res) {
  CardType.findById(req.params.id, function (err, cardType) {
    if(err) { return handleError(res, err); }
    if(!cardType) { return res.status(404).send('Not Found'); }
    return res.json(cardType);
  });
};

// Creates a new cardType in the DB.
exports.create = function(req, res) {
  CardType.create(req.body, function(err, cardType) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(cardType, function (err) {
      if (err) { return handleError(res, err); }
    });
    return res.status(201).json(cardType);
  });
};

// Updates an existing cardType in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  CardType.findById(req.params.id, function (err, cardType) {
    if (err) { return handleError(res, err); }
    if(!cardType) { return res.status(404).send('Not Found'); }
    var updated = _.merge(cardType, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(cardType);
    });
  });
};

// Deletes a cardType from the DB.
exports.destroy = function(req, res) {
  CardType.findById(req.params.id, function (err, cardType) {
    if(err) { return handleError(res, err); }
    if(!cardType) { return res.status(404).send('Not Found'); }
    cardType.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
