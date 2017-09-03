'use strict';

const _ = require('lodash');
const activity = require('../activity').createActivity();
const Promotion = require('../../api/promotion/promotion.model');
const graphModel = require('../graph-tools').createGraphModel('promotion');
const Instance = require('../instance');

exports.follow = function(userId, entityId, callback){
  let query = `MATCH (e{_id:'${entityId}'})-[action:ON_ACTION]->(p:promotion) 
               WHERE action.type = 'FOLLOW' and action.end <= timestamp()
               return p._id as promotionId, type(e) as entity_type`;
  graphModel.query(query, function(err, actions){
    if(err) return callback(err);
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
          act['actor' + action.entity_type] = entityId;
          activity.create(act);
        })
      })
    })
  })
};

exports.proximity = function(userId, location, callback){

};
