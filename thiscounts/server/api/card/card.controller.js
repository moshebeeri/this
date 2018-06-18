'use strict';

let _ = require('lodash');
let Card = require('./card.model');
let CardType = require('../cardType/cardType.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('card');
let MongodbSearch = require('../../components/mongo-search');
const qrcodeController = require('../qrcode/qrcode.controller');
const QRCode = require('../qrcode/qrcode.model');


exports.search = MongodbSearch.create(Card);

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

exports.chargeCode = function(req, res) {
  Card.findById(req.params.card, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return qrcodeController.image_png(req, res)
  });
};

exports.charge = function(req, res) {
  const userId = req.user._id;
  const cardId = req.params.card;
  Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return res.json(card);
  });
};

exports.redeem = function(req, res) {
  Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return res.json(card);
  });
};

// Creates a new card in the DB.
exports.create = function(req, res) {
  let card = req.body;
  card.user = req.user._id;
  const cardTypeId = card.card_type._id;
  CardType.findById(cardTypeId).exec((err, cardType) => {
    if (err) return handleError(res, err);
    qrcodeController.createAndAssign(card.user, {
      type: 'PROMOTION',
      assignment: {
        //card: card._id
      }
    }, function (err, qrcode) {
      if (err) return handleError(res, err);
      card.qrcode = qrcode;
      Card.create(card, function (err, card) {
        if (err) { return handleError(res, err)}
        graphModel.reflect(card, function (err, card) {
          if (err) {return handleError(res, err)}
          graphModel.relate_ids(req.user._id, 'CARD_MEMBER', card._id);
          graphModel.relate_ids(card._id, 'CARD_TYPE', cardType._id);
        });
        return res.json(201, card);
      });
    });
  })
};

// Updates an existing card in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Card.findById(req.params.id, function (err, card) {
    if (err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    let updated = _.merge(card, req.body);
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
