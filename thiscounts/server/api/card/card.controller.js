'use strict';

let _ = require('lodash');
let Card = require('./card.model');
let CardType = require('../cardType/cardType.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('card');
let MongodbSearch = require('../../components/mongo-search');
const qrcodeController = require('../qrcode/qrcode.controller');
const QRCode = require('../qrcode/qrcode.model');
const utils = require('../../components/utils').createUtils();
const QRCodeImg = require('qrcode');
const fireEvent = require('../../components/firebaseEvent');

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

exports.byCode = function(req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if(err) { return handleError(res, err); }
    if(!qrcode) { return res.status(404).send(); }
    if(!qrcode.assignment || !qrcode.assignment.card)
      return res.status(500).send(`no assignment found`);
    Card.findById(qrcode.assignment.card).exec((err, card) => {
      if(err) {return handleError(res, err)}
      return res.status(200).json(card);
    });

  });
};

exports.byCardType = function(req, res) {
  const query = `MATCH (u:user{_id:'${req.user._id}'})-[r:LOYALTY_CARD]->(card:card)<-[:CARD_OF_TYPE]-(cardType:cardType{_id:'${req.params.cardType}'}) RETURN card._id as _id`;
  graphModel.query_objects(Card, query,
    'order by r.timestamp desc', 0, 1, function (err, cards) {
      if (err) {return handleError(res, err)}
      if (!cards) {return res.status(404).send()}
      return res.status(200).json(cards[0]);
    });
};

exports.chargeCode = function(req, res) {
  Card.findById(req.params.cardId, function (err, card) {
    if (err) {return handleError(res, err)}
    if (!card) {return res.status(404).send()}
    QRCode.findById(card.qrcode, function (err, qrcode) {
      if (err) {return handleError(res, err)}
      if (!qrcode) {return res.status(404).send()}
      QRCodeImg.toDataURL(JSON.stringify({
        t: 'lc',
        opt: req.params.opt,
        code: qrcode.code
      }), {errorCorrectionLevel: 'H', scale: 16}, function (err, url) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(url);
      });
    });
  });
};

exports.charge = function(req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if (err) {return handleError(res, err)}
    if(!qrcode.assignment || !qrcode.assignment.card)
      return handleError(res, new Error('no cardId found'));
    Card.findById(qrcode.assignment.card, function (err, card) {
      if(err) { return handleError(res, err)}
      if(!card) { return res.status(404).send()}
      card.points = card.points? card.points + parseInt(req.params.points) : parseInt(req.params.points);
      card.save((err) => err? console.error(err) : null);
      fireEvent.info('card', card._id, 'card_charged', {
        cardId: card._id,
        points: card.points
      });
      return res.status(200).json(card);
    });
  });
};

exports.redeem = function(req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if (err) {return handleError(res, err)}
    if(!qrcode.assignment || !qrcode.assignment.card)
      return handleError(res, new Error('no cardId found'));
    Card.findById(qrcode.assignment.card, function (err, card) {
      if(err) { return handleError(res, err)}
      if(!card) { return res.status(404).send()}
      if(card.points < req.params.points)
        return res.status(500).json(new Error(`insufficient points`));
      card.points =  card.points - parseInt(req.params.points);
      card.save((err) => err? console.error(err) : null);
      fireEvent.info('card', card._id, 'card_redeemed', {
        cardId: card._id,
        points: card.points
      });
      return res.status(200).json(card);
    });
  });
};

exports.doRedeem = function(userId, cardTypeId, points, callback) {
  const query = `MATCH (u:user{_id:'${userId}'})-[r:LOYALTY_CARD]->(card:card)<-[:CARD_OF_TYPE]-(cardType:cardType{_id:'${cardTypeId}'}) RETURN card._id as _id`;
  console.log(`doRedeem: ${query}`);
  graphModel.query_objects(Card, query,
    'order by r.timestamp desc', 0, 1, function (err, cards) {
    if(err) {return callback(err)}
    if(cards.length === 0 ) { return callback(`no card found`)}
    const card = cards[0];
    if(card.points < points)
      return callback(new Error(`insufficient points`));
    card.points =  card.points - parseInt(points);
    card.save((err) => err? console.error(err) : null);
    fireEvent.info('card', card._id, 'card_redeemed', {
      cardId: card._id,
      points: card.points
    });
    return callback(null, card);
  });
};

exports.touch = function (req, res) {
  touch(req.user._id, req.params.cardId, function (err) {
    if (err) console.error(err.message);
  });
  return res.status(200).send();
};

function touch(userId, cardId, callback) {
  let query = `match (u:user{_id:'${userId}'})-[r:LOYALTY_CARD]->(c:card{_id:'${cardId}'}) set r.timestamp=timestamp()`;
  graphModel.query(query, callback ? callback : (err) => {
    if (err) console.error(err);
  });
}

exports.mine = function (req, res) {
  let paginate = utils.to_paginate(req);
  const query = `MATCH (u:user{_id:'${req.user._id}'})-[r:LOYALTY_CARD]->(card:card)<-[:CARD_OF_TYPE]-(cardType:cardType) RETURN card._id as _id`;
  graphModel.query_objects(Card, query,
    'order by r.timestamp desc', paginate.skip, paginate.limit, function (err, cards) {
      if (err) {
        console.error(err);
        return handleError(res, err)
      }
      if (!cards) {
        return res.status(404).send();
      }
      return res.status(200).json(cards);
    });
};

exports.createCard = function(userId, cardTypeId, callback) {
  let card = {};
  card.cardType = cardTypeId;
  card.user = userId;
  CardType.findById(cardTypeId).exec((err, cardType) => {
    if (err) return callback(err);
    //check if user has this cardType card
    const query = `MATCH (u:user{_id:'${userId}'})-[:LOYALTY_CARD]->(c:card)-[r]->(ct:cardType{_id:'${cardTypeId}'}) RETURN count(r)>0 as has`;
    graphModel.query(query, (err, results) => {
      if (err) return callback(err);
      if (results.length !== 1) return callback(new Error('unexpected result length'));
      if (results[0].has) return callback(new Error('already has instance of this'));
      Card.create(card, function (err, card) {
        if (err) {
          return callback(err)
        }
        qrcodeController.createAndAssign(card.user, {
          type: 'LOYALTY_CARD',
          assignment: {
            card: card._id
          }
        }, function (err, qrcode) {
          if (err) return callback(err);
          //will be save with the reflect process
          card.qrcode = qrcode;
          graphModel.reflect(card, {
              _id: card._id,
              user: userId
            },
            function (err, card) {
              if (err) {
                return callback(err)
              }
              graphModel.relate_ids(userId, 'LOYALTY_CARD', card._id, `{timestamp: ${Date.now()}}`);
              graphModel.relate_ids(cardType._id, 'CARD_OF_TYPE', card._id);
                return callback(null, card);
            });
        });
      });
    })
  })
};

// Creates a new card in the DB.
exports.create = function(req, res) {
  let card = req.body;
  card.user = req.user._id;
  this.createCard(card.user, card.card_type._id, (err, card) => {
    if (err) { return handleError(res, err); }
    return res.status(200).json(card);
  });
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
