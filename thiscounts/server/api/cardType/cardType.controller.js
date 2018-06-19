'use strict';

let _ = require('lodash');
let CardType = require('./cardType.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('cardType');
const MongodbSearch = require('../../components/mongo-search');
const utils = require('../../components/utils').createUtils();
const cardController = require('../card/card.controller');
exports.search = MongodbSearch.create(CardType);

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

function getCardEntity(card){
  if(!card.entity) return null;
  if(card.entity.business      ) return card.entity.business      ;
  if(card.entity.shopping_chain) return card.entity.shopping_chain;
  if(card.entity.mall          ) return card.entity.mall          ;
  if(card.entity.brand         ) return card.entity.brand         ;
  if(card.entity.group         ) return card.entity.group         ;
  return null;
}

function createGraphParams(card) {
  return `{add_policy: ${card.add_policy}, min_points: ${card.min_points}, points_ratio: ${card.points_ratio}, accumulate_ratio: ${card.accumulate_ratio}}`;
}

function addEntityFollowerToCard(cardType, callback) {
  if(cardType.add_policy !== 'OPEN')
    return;
  const entity = getCardEntity(cardType);
  let query = `MATCH (u:user)-[:FOLLOW]->(e{_id:'${entity}'})-[:LOYALTY_CARD]->(ct{_id:'${cardType._id}'}) 
                return u._id as _id` ;
  console.log('addEntityFollowerToCard');
  console.log(query);
  graphModel.query(query, (err, results) => {
    if (err) return callback(err);
    console.log(JSON.stringify(results));
    results.forEach(result => {
      console.log(JSON.stringify(result));
      cardController.createCard(result._id, cardType._id, (err, card) => {
        if (err) { return callback(err); }
        return callback(null, card);
      });
    })
  })
}

// Creates a new cardType in the DB.
exports.create = function(req, res) {
  let cardType = req.body;
  const entity = getCardEntity(cardType);
  if (!entity) return handleError(res, new Error(`bad request no entity found`));
  //check for user permissions
  const query = `MATCH (u:user{_id:'${req.user._id}'})-[r:ROLE]->(e{_id:'${entity}'}) where r.name in ['OWNS','Admin'] RETURN count(r)>0 as permitted`;
  graphModel.query(query, (err, results) => {
    if (err) return handleError(res, err);
    if (results.length !== 1) return handleError(res, new Error('unexpected result length'));
    if(!results[0].permitted) return handleError(res, new Error('unauthorized user'));

    CardType.create(cardType, function (err, cardType) {
      if (err) {
        return handleError(res, err);
      }
      graphModel.reflect(cardType, {
        _id: cardType._id,
        add_policy: cardType.add_policy,
        min_points: cardType.points.min_points,
        points_ratio: cardType.points_ratio,
        accumulate_ratio: cardType.points.accumulate_ratio
      }, function (err, cardType) {
        if (err) {
          return handleError(res, err);
        }
        graphModel.relate_ids(entity.toString(), 'LOYALTY_CARD', cardType._id.toString(), '', (err) => {
          if (err) {return handleError(res, err)}
          if(cardType.add_policy === 'OPEN')
            addEntityFollowerToCard(cardType, (err) => {if(err) console.error(err)});
          return res.status(201).json(cardType);
        });
      });
    });
  })
};

exports.entity = function (req, res) {
  //TODO: add social state
  let paginate = utils.to_paginate(req);
  const query = `MATCH (e{_id:'${req.params.entity}'})-[:LOYALTY_CARD]->(cardType:cardType) RETURN cardType._id as _id`;
  graphModel.query_objects(CardType, query,
    'order by _id DESC', paginate.skip, paginate.limit, function (err, cards) {
      if (err) {
        return handleError(res, err)
      }
      if (!cards) {
        return res.send(404)
      }
      return res.status(200).json(cards);
    });
};


// Updates an existing cardType in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  CardType.findById(req.params.id, function (err, cardType) {
    if (err) { return handleError(res, err); }
    if(!cardType) { return res.status(404).send('Not Found'); }
    let updated = _.merge(cardType, req.body);
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
