'use strict';

let _ = require('lodash');
let util = require('util');
let graphTools = require('../graph-tools');
let graphModel = graphTools.createGraphModel('feed');
let logger = require('../logger').createLogger();
let utils = require('../utils').createUtils();
let mongoose = require('mongoose');

let Feed = require('../../api/feed/feed.model');
let ActivitySchema = require('../../api/activity/activity.model');
const fireEvent = require('../firebaseEvent');

function Activity() {
}

function getActivityActor(activity) {
  let actor = null;
  if (activity.actor_user)
    actor = activity.actor_user;
  if (activity.actor_business)
    actor = activity.actor_business;
  if (activity.actor_group)
    actor = activity.actor_group;
  if (activity.actor_mall)
    actor = activity.actor_mall;
  if (activity.actor_chain)
    actor = activity.actor_chain;

  if(actor && actor._id)
    return actor._id.toString();
  return actor;
}

//pagination http://blog.mongodirector.com/fast-paging-with-mongodb/
function update_feeds(effected, activity) {
  activity.distributions = 0;
  if(!activity.audience || _.includes(activity.audience, 'FOLLOWERS')) {
    activity.distributions += effected.length;
    effected.forEach(function (entity) {
      //console.log(`update_feeds FOLLOWERS entity: ${entity._id} `);
      Feed.create({
        entity: entity._id,
        activity: activity._id
      }, function (err, feed) {
        if (err) {
          return logger.error(err.message);
        }
        fireEvent.change('feed', entity._id);
      });
    });
  }
  if (_.includes(activity.audience, 'SELF')) {
    const actor = getActivityActor(activity);
    effected = effected.map(e=>e._id);
    if(actor) {
      //console.log(`update_feeds SELF entity: ${actor}`);
      if (!effected.includes(actor)) {
        activity.distributions += 1;
        Feed.create({
          entity: actor,
          activity: activity._id
        }, function (err, feed) {
          if (err) {
            return logger.error(err.message);
          }
          fireEvent.change('feed', actor);
        });
      }
    }else{
      console.error(`failed to send activity to actor ${JSON.stringify({actor, activity})}`);
    }
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
    // console.log('=======act======');
    // console.log(JSON.stringify(act));
    // console.log('====activity====');
    // console.log(JSON.stringify(activity));
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
      console.log(`Activity not distributed: ${JSON.stringify(act)}`);
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







