'use strict';

var _ = require('lodash');
var Card = require('./card.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('card');

// Get list of cards
exports.index = function(req, res) {
  Card.find(function (err, cards) {
    if(err) { return handleError(res, err); }
    return res.json(200, cards);
  });
};

// Get a single card
exports.show = function(req, res) {
  Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return res.json(card);
  });
};

// Creates a new card in the DB.
exports.create = function(req, res) {
  Card.create(req.body, function(err, card) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(card, function (err, card) {
      if (err) { return handleError(res, err); }
      graphModel.relate_ids(req.user._id, 'CARD_MEMBER', card._id);
      graphModel.relate_ids(card._id, 'CARD_TYPE', card.card_type._id);
    });
    return res.json(201, card);
  });
};

// Updates an existing card in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Card.findById(req.params.id, function (err, card) {
    if (err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    var updated = _.merge(card, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, card);
    });
  });
};

// Deletes a card from the DB.
exports.destroy = function(req, res) {
  Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    card.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
