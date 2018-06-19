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
    return res.status(200).json(cards);
  });
};

// Get a single card
exports.show = function(req, res) {
  Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return res.status(200).json(card);
  });
};

exports.chargeCode = function(req, res) {
  Card.findById(req.params.card, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.status(404).send(); }
    req.params.code = card.qrcode.code;
    return qrcodeController.image_png(req, res)
  });
};

exports.charge = function(req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if (err) {return handleError(res, err)}
    if(!qrcode.assignment || !qrcode.assignment.cardId)
      return handleError(res, new Error('no cardId found'));
    Card.findById(qrcode.assignment.cardId, function (err, card) {
      if(err) { return handleError(res, err)}
      if(!card) { return res.status(404).send()}
      card.points = card.points? card.points + req.params.points : req.params.points;
      return res.status(200).json(card);
    });
  });
};

exports.redeem = function(req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if (err) {return handleError(res, err)}
    if(!qrcode.assignment || !qrcode.assignment.cardId)
      return handleError(res, new Error('no cardId found'));
    Card.findById(qrcode.assignment.cardId, function (err, card) {
      if(err) { return handleError(res, err)}
      if(!card) { return res.status(404).send()}
      if(card.points < req.params.points)
        return res.status(500).json(new Error(`insufficient points`));
      card.points =  card.points - req.params.points;
      return res.status(200).json(card);
    });
  });
};

// Creates a new card in the DB.
exports.create = function(req, res) {
  let card = req.body;
  card.user = req.user._id;
  const cardTypeId = card.card_type._id;
  CardType.findById(cardTypeId).exec((err, cardType) => {
    if (err) return handleError(res, err);
    //check if user has this cardType card
    const query = `MATCH (u:user{_id:'${req.user._id}'})-[:LOYALTY_CARD]->(c:Card)-[]->(ct:CardType{_id:'${cardTypeId}'}) RETURN count(r)>0 as has`;
    graphModel.query(query, (err, results) => {
      if (err) return handleError(res, err);
      if (results.length !== 1) return handleError(res, new Error('unexpected result length'));
      if(results[0].has) return handleError(res, new Error('already has instance of this'));
      Card.create(card, function (err, card) {
        if (err) { return handleError(res, err)}
        qrcodeController.createAndAssign(card.user, {
          type: 'Card',
          assignment: {
            cardId: card._id
          }
        }, function (err, qrcode) {
          if (err) return handleError(res, err);
          //will be save with the reflect process
          card.qrcode = qrcode;
          graphModel.reflect(card, {
              user: req.user._id
            },
            function (err, card) {
              if (err) {return handleError(res, err)}
              graphModel.relate_ids(req.user._id, 'LOYALTY_CARD', card._id);
              graphModel.relate_ids(cardType._id, 'CARD_OF_TYPE', card._id);
              return res.status(201).json(card);
            });
        });
      });
    })
  })
};

// Updates an existing card in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Card.findById(req.params.id, function (err, card) {
    if (err) { return handleError(res, err); }
    if(!card) { return res.status(404).send(); }
    let updated = _.merge(card, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(card);
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
      return res.status(204).send();
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
