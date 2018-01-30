'use strict';

let _ = require('lodash');
let util = require('util');
let graphTools = require('../graph-tools');
let graphModel = graphTools.createGraphModel('feed');
let logger = require('../logger').createLogger();
let utils = require('../utils').createUtils();
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let Feed = require('../../api/feed/feed.model');
let ActivitySchema = require('../../api/activity/activity.model');

function Activity() {
}

function getActivityActor(activity) {
  if (activity.actor_user)
    return activity.actor_user;
  if (activity.actor_business)
    return activity.actor_business;
  if (activity.actor_group)
    return activity.actor_group;
  if (activity.actor_mall)
    return activity.actor_mall;
  if (activity.actor_chain)
    return activity.actor_chain;
}

//pagination http://blog.mongodirector.com/fast-paging-with-mongodb/
function update_feeds(effected, activity) {
  console.log(JSON.stringify(activity));

  activity.distributions = 0;
  if(!activity.audience || _.includes(activity.audience, 'FOLLOWERS')) {
    activity.distributions += effected.length;

    console.log(JSON.stringify(effected));
    effected.forEach(function (entity) {
      console.log(`include followers sends to ${JSON.stringify(entity._id)}`);

      Feed.create({
        entity: entity._id,
        activity: activity._id
      }, function (err) {
        if (err) {
          logger.error(err.message);
        }
      });
    });
  }
  if (_.includes(activity.audience, 'SELF')) {
    activity.distributions += 1;
    console.log(`include self sends to ${JSON.stringify(getActivityActor(activity))}`);

    Feed.create({
      entity: getActivityActor(activity),
      activity: activity._id
    }, function (err) {
      if (err) {
        logger.error(err.message);
      }
    });
  }
}

/**
 *
 * {
 *   promotion : promotion ,
 *   product   : product   ,
 *   user      : user      ,
 *   business  : business  ,
 *   mall      : mall      ,
 *   chain     : chain     ,
 *
 *   actor_user      : user      ,
 *   actor_business  : business  ,
 *   actor_mall      : mall      ,
 *   actor_chain     : chain     ,
 *
 *   action    : action
 * }
 * @param act
 * @param callback
 */
Activity.prototype.activity = function activity(act, callback) {
  activity_impl(act, callback);
};

Activity.prototype.create = function create(act, callback) {
  this.activity(act, function (err, activity) {
    if(callback){
      if (err) callback(err);
      callback(null, activity);
    }
    if (err) return console.error(err.message);
  });
};

function activity_impl(act, callback) {
  act.timestamp = Date.now();

  function handleSuccess(activity) {
    return activity.save(callback)
  }

  ActivitySchema.create(act, function (err, activity) {
    if (err) return callback(err, null);
    activity.audience = act.audience;

    if(act.ids){
      let effected = [];
      activity.ids.forEach(_id => effected.push({_id:_id}));
      update_feeds(effected, activity);
      return handleSuccess(activity)
    }

    if(act.audience && !_.includes(act.audience, 'FOLLOWERS')) {
      update_feeds([], activity);
      return handleSuccess(activity)
    }

    if (activity.actor_user) {
      effected_in_rel(activity.actor_user, 'FOLLOW', function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        return handleSuccess(activity)
      });
    }
    else if (activity.actor_business) {
      effected_in_rel(activity.actor_business, 'FOLLOW', function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        return handleSuccess(activity)
      });
    }
    else if (activity.actor_mall) {
      effected_in_rel(activity.actor_mall, 'FOLLOW', function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        return handleSuccess(activity)
      });
    }
    else if (activity.actor_chain) {
      effected_in_rel(activity.actor_chain, 'FOLLOW', function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        return handleSuccess(activity)
      });
    }
    else if (activity.actor_group) {
      effected_in_rel(activity.actor_group, 'FOLLOW', function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        return handleSuccess(activity)
      });
    }else {
      return callback(new Error('Activity not distributed expected ids. audience or actor_*'));
    }
  });
}

Activity.prototype.action_activity = function action_activity(userId, itemId, action, callback) {
  let act = {
    actor_user: userId,
    action: action
  };
  utils.parallel_id(itemId, act, function (err, act) {
    if (err && callback) {
      return callback(err, null)
    }
    activity_impl(act, function (err) {
      if (err) {
        if(callback)
          return callback(err);
        else
          return logger.error(err)
      }
    });
  });
};

function run(query, callback) {
  let db = graphModel.db();
  db.query(query, function (err, effected) {
    if (err) {
      return callback(err, null);
    }
    callback(null, effected);
  });
}
//MATCH (actor) where actor._id='56a3cb8071cef8c460461c08' return actor
function effected_out_rel(actor_id, relationship, callback) {
  let query = ` MATCH (actor)-[:${relationship}]->(effected) 
                where actor._id='${actor_id}' and actor <> effected 
                return effected._id as _id`;
  run(query, callback);
}

function effected_in_rel(actor_id, relationship, callback) {
  let query = `MATCH (actor)<-[:${relationship}]-(effected) 
                            where actor._id='${actor_id}' and actor <> effected 
                            return effected._id as _id`;
  run(query, callback);
}


module.exports = Activity;







