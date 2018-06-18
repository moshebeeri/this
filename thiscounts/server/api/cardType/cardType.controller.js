'use strict';

let _ = require('lodash');
let CardType = require('./cardType.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('cardType');
const MongodbSearch = require('../../components/mongo-search');

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
        add_policy: cardType.add_policy,
        min_points: cardType.min_points,
        points_ratio: cardType.points_ratio,
        accumulate_ratio: cardType.accumulate_ratio
      }, function (err) {
        console.log(`I am here e1`);
        if (err) {
          console.log(`I am here e2`);
          return handleError(res, err);
        }
        console.log(`I am here e4`);
        graphModel.relate_ids(entity, 'LOYALTY_CARD', cardType._id, '', (err) => {
          if (err) {
            return handleError(res, err);
          }
          console.log(`I am here e5`);
          return res.status(201).json(cardType);
        });
      });
    });
  })
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
