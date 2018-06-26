'use strict';

let _ = require('lodash');
let CardType = require('./cardType.model');
let User = require('../user/user.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('cardType');
const MongodbSearch = require('../../components/mongo-search');
const utils = require('../../components/utils').createUtils();
const cardController = require('../card/card.controller');
const qrcodeController = require('../qrcode/qrcode.controller');
const util = require('util');
const i18n = require('../../components/i18n');
const Notifications = require('../../components/notification');

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

function getCardEntity(cardType){
  if(!cardType.entity) return null;
  if(cardType.entity.business      ) return cardType.entity.business      ;
  if(cardType.entity.shopping_chain) return cardType.entity.shopping_chain;
  if(cardType.entity.mall          ) return cardType.entity.mall          ;
  if(cardType.entity.brand         ) return cardType.entity.brand         ;
  if(cardType.entity.group         ) return cardType.entity.group         ;
  return null;
}

function addEntityFollowerToCard(cardType, callback) {
  if(cardType.add_policy !== 'OPEN')
    return;
  const entity = getCardEntity(cardType);
  let query = `MATCH (u:user)-[:FOLLOW]->(e{_id:'${entity}'})-[:LOYALTY_CARD]->(ct{_id:'${cardType._id}'}) 
                return u._id as _id` ;
  graphModel.query(query, (err, results) => {
    if (err) return callback(err);
    results.forEach(result => {
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

    cardType.creator = req.user._id;
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
          qrcodeController.createAndAssign(cardType.creator, {
            type: 'LOYALTY_CARD_TYPE',
            assignment: {
              cardType: cardType._id
            }
          }, function (err, qrcode) {
            if (err) {return handleError(res, err)}
            cardType.qrcode = qrcode;
            cardType.save((err, cardType)=>{
              if (err) {return handleError(res, err)}
              return res.status(201).json(cardType);
            })
          });
        });
      });
    });
  })
};

function sendCardTypeNotification(actor_user, audience, cardType, type) {
  audience.forEach(to => {
    User.findById(to).exec((err, user) => {
      if(err) return console.error(err);
      if(!user) return console.error(new Error(`User not found for id ${to}`));

      function generateText() {
        if (type === 'card_ask_join') {
          return {
            title: 'ASK_JOIN_CARD_TYPE_TITLE',
            body: util.format(i18n.get('ASK_JOIN_CARD_TYPE_BODY', user.locale), '')
          }
        }else if(type === 'card_ask_invite'){
          return {
            title: 'ASK_INVITE_CARD_TYPE_TITLE',
            body: util.format(i18n.get('ASK_INVITE_CARD_TYPE_BODY', user.locale), '')
          }
        }
        throw new Error('unsupported type')
      }
      try{
        let {title, body} = generateText();
        let note = {
          note: type,
          cardType: cardType._id,
          title: title,
          body: body,
          actor_user: actor_user,
          timestamp: Date.now()
        };
        Notifications.notifyUser(note, user._id, true);
      }catch(err){
        console.error(err)
      }
    })
  });
}

exports.invite = function (req, res) {
  let userId = req.user._id;
  let cardType = req.params.cardType;
  let user = req.params.user;

  function invite(cardType) {
    let invited = `MATCH (u:user {_id:'${user}'})-[i:INVITE_CARD_TYPE]->(g:cardType{_id:"${cardType._id}"}) return count(i)>0 as invited`;
    graphModel.query(invited, function (err, results) {
      if (err) return handleError(res, err);
      if (results[0].invited) return handleError(res, new Error('user already invited'));
      let create = `MATCH (g:cardType{_id:"${cardType._id}"}), (u:user {_id:'${user}'})
                  CREATE UNIQUE (u)-[:INVITE_CARD_TYPE]->(g)`;
      graphModel.query(create, function (err) {
        if (err) return handleError(res, err);
        sendCardTypeNotification(userId, [user], cardType, 'card_ask_invite');
        return res.status(200).json(cardType);
      })
    })
  }


  CardType.findById(cardType, function (err, cardType) {
    if (err) return handleError(res, err);
    if (!cardType) return res.status(404).send('no cardType');
    if (cardType.add_policy === 'INVITE') {
      let query = `MATCH (u:user {_id:'${userId}'})-[r:ROLE]->(e{_id:"${getCardEntity(cardType)._id}"}) return r`;
      graphModel.query(query, function (err, rs) {
        if (err) return handleError(res, err);
        if (rs.length === 0)
          return res.status(404).send('user can not invite');
        return invite(cardType);
      })
    } else {
      return res.status(401).send('unauthorized');
    }
  });
};

exports.inviteAccepted = function (req, res) {
  let userId = req.user._id;
  let cardTypeId = req.params.cardTypeId;
  let query = `MATCH (u:user {_id:'${userId}'})-[r:INVITE_CARD_TYPE]->(g:cardType{_id:"${cardTypeId}"}) return r, type(r) as type`;
  console.log(`approve_invite_cardType q=${query}`);
  graphModel.query(query, function (err, rs) {
    if (err) return handleError(res, err);
    if (rs.length === 0)
      return res.status(404).json('user not invited');
    cardController.createCard(userId, cardTypeId, function (err) {
      if (err) return handleError(res, err);
      graphModel.unrelate_ids(userId, 'INVITE_CARD_TYPE', cardTypeId);
      return res.status(200).json(cardTypeId);
    })
  });
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
  console.error(err.message);
  return res.status(500).send(err);
}
