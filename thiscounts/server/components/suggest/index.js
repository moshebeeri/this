'use strict';
const config = require('../../config/environment');
const activity = require('../activity').createActivity();
const proximity = require('../proximity');
const graphTools = require('../graph-tools');
const graphModel = graphTools.createGraphModel('user');
const Notifications = require('../notification');

function Suggest() {
}

function businessesWithinDistance(userId, callback){
  proximity.businessesWithinDistance(userId, 30000, (err, businesses) => {
    if(err) return callback(err);
    return callback(null, businesses);
  })
}

function businessesFollowedByFriends(userId, callback){
  const query = `match (u:user{_id:'${userId}'})-[:FOLLOW]->(friend:user)-[:FOLLOW]-(b:business)
                  where not (u)-[:FOLLOW]-(b)
                  return distinct b._id as business limit 5`;
  graphModel.query(query, (err, businesses) => {
    if(err) return callback(err);
    return callback(null, businesses);
  })
}

function businessSuggestActivity(userId, businessesIds){
  businessesIds.forEach(businessId => {
    activity.activity({
      user: userId,
      action: 'business_suggestion',
      business: businessId,
      sharable: true,
      audience: ['SELF']
    }, function (err) {
      if (err) console.error(err.message)
    });
  })
}

function promotionSuggestActivity(userId, suggestions){
  suggestions.forEach(suggestion => {
    activity.activity({
      user: userId,
      action: 'promotion_suggestion',
      instance: suggestion.instanceId,
      promotion: suggestion.promotionId,
      sharable: false,
      audience: ['SELF']
    }, function (err) {
      if (err) console.error(err.message)
    });
  })
}

function businessSuggestNotification(userId, businessesIds){
  //TODO: remove remarks in order to enable this feature
  // businessesIds.forEach(businessId => {
  //   Notifications.notify({
  //     note: 'BUSINESS_FOLLOW_SUGGEST',
  //     business: businessId,
  //   }, [userId])
  // })
}

Suggest.businesses =
  Suggest.prototype.businesses = function(userId, callback) {
    this.findBusinesses(userId, (err, businessesIds) => {
      if(err) return callback(err);
      businessSuggestNotification(userId, businessesIds);
      callback(null);
    });
  };

Suggest.findBusinesses =
  Suggest.prototype.findBusinesses = function(userId, callback) {
    function unique(a) {
      let seen = {};
      return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    }

    businessesFollowedByFriends(userId, (err, businesses) => {
      if(err) { return callback(err);}
      let ret = businesses;
      businessesWithinDistance(userId, (err, businesses) => {
        if(err) return callback(err);
        ret = ret.concat(businesses);
        ret = ret.map(o => o.business);
        return callback(null, unique(ret));
      });
    });
  };

Suggest.publicGroups =
  Suggest.prototype.publicGroups = function(payer, callback) {
};

Suggest.usersToFollow =
  Suggest.prototype.usersToFollow = function (userId, callback) {
  };

Suggest.promotionsToNewBusinessFollower =
  Suggest.prototype.promotionsToNewBusinessFollower = function (businessId, userId, callback) {
    const query = `match (u:user{_id:'${userId}'})-[:FOLLOW]->(b:business{_id:'${businessId}'})<-[:BUSINESS_PROMOTION]-(p:promotion)<-[:INSTANCE_OF]-(i:instance)
                   where not (u)-[:SAVED]->(:SavedInstance)-[:SAVE_OF]->(i)
                         and i.quantity > 0
                   return distinct i._id as instanceId, p._id as promotionId limit 5`;
    graphModel.query(query, (err, suggestions) => {
      if(err) return callback(err);
      promotionSuggestActivity(userId, suggestions);
      return callback(null, suggestions);
    })
  };

module.exports = Suggest;


