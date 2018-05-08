'use strict';
const config = require('../../config/environment');
const activity = require('../activity').createActivity();
const proximity = require('../proximity');
const graphTools = require('../graph-tools');
const graphModel = graphTools.createGraphModel('user');

function Suggest() {
}

function businessesWithinDistance(userId, callback){
  proximity.businessesWithinDistance(userId, 10000, (err, businesses)=>{
    if(err) return callback(err);
    console.log(`businessesWithinDistance ${JSON.stringify(businesses)}`);
  })
}

function businessesFollowedByFriends(userId, callback){
  const query = `match (u:user{_id:'${userId}'})-[:FOLLOW]->(friend:user)-[:FOLLOW]-(b:business)
                  where not (u)-[:FOLLOW]-(b)
                  return b._id as businesses limit 5`;
  graphModel.query(query, (err, businesses)=>{
    if(err) return callback(err);
    console.log(`businessesFollowedByFriends ${JSON.stringify(businesses)}`);
  })
}

function businessSuggestActivity(userId, businesses){
  businesses.forEach(business=>{
    activity.activity({
      user: userId,
      action: 'business_suggestion',
      business: business._id,
      sharable: true,
      audience: ['SELF']
    }, function (err) {
      if (err) console.error(err.message)
    });
  })
}

Suggest.businesses =
  Suggest.prototype.businesses = function(userId, callback) {
    businessesFollowedByFriends(userId, (err, businesses)=>{
      if(err) return callback(err);
      businessSuggestActivity(businesses);
      businessesWithinDistance(userId, (err, businesses)=>{
        if(err) return callback(err);
        businessSuggestActivity(businesses);
        callback(null);
      });
    });
  };

Suggest.findBusinesses =
  Suggest.prototype.businesses = function(userId, callback) {
    businessesFollowedByFriends(userId, (err, businesses)=>{
      if(err) return callback(err);
      let ret = businesses;
      businessesWithinDistance(userId, (err, businesses)=>{
        if(err) return callback(err);
        ret = ret.concat(businesses);
        callback(null, ret);
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


