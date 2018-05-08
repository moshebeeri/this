'use strict';
const config = require('../../config/environment');
const activity = require('../activity').createActivity();
const proximity = require('../proximity');
const graphTools = require('../graph-tools');
const graphModel = graphTools.createGraphModel('user');

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

Suggest.businesses =
  Suggest.prototype.businesses = function(userId, callback) {
    this.findBusinesses(userId, (err, businessesIds) => {
      if(err) return callback(err);
      businessSuggestActivity(businessesIds);
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
  Suggest.prototype.usersToFollow = function (entity, callback) {
  };

module.exports = Suggest;


