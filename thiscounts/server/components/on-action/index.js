'use strict';

const _ = require('lodash');
const activity = require('../activity').createActivity();
const Promotion = require('../../api/promotion/promotion.model');
const graphModel = require('../graph-tools').createGraphModel('promotion');
const Instance = require('../instance');

exports.follow = function(userId, entityId, callback){
  if(!callback) callback = (err) => {if(err) console.error(err)};

  let query = `MATCH (e{_id:'${entityId}'})-[action:ON_ACTION]->(p:promotion) 
               WHERE action.type = 'FOLLOW_ENTITY' and action.end <= timestamp()
               return p._id as promotionId, labels(e) as entity_type`;
  graphModel.query(query, function(err, actions){
    if(err) return callback(err);
    console.log(`on action follow`);
    actions.forEach( action => {
      Promotion.findById(action.promotionId, function (err, promotion) {
        if(err) return callback(err);
        Instance.createSingleInstance(promotion, function (err, instance) {
          if(err) return callback(err);
          let act = {
            instance: instance._id,
            promotion: instance.promotion._id,
            ids: [userId],
            action: "eligible_on_activity_follow"
          };
          act['actor_' + action.entity_type[0]] = entityId;
          console.log(`on action follow act: ${act}`);
          activity.create(act);
        })
      })
    })
  })
};

exports.proximity = function(userId, location, callback){

};
