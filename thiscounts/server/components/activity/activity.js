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
  logger.info("Activity constructed");
}

function getActivityActor(activity) {
  if (activity.actor_user)
    return actor_user;
  if (activity.actor_business)
    return actor_business;
  if (activity.actor_group)
    return actor_group;
  if (activity.actor_mall)
    return actor_mall;
  if (activity.actor_chain)
    return actor_chain;
}

//pagination http://blog.mongodirector.com/fast-paging-with-mongodb/
function update_feeds(effected, activity) {
  if(!activity.audience || _.includes(activity.audience, 'FOLLOWERS')) {
    effected.forEach(function (entity) {
      console.log(`entity._id=${entity._id} activity._id=${activity._id}`);
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

/*
function update_group_feeds(effected, activity) {
  mongoose.connection.db.collection('feed', function (err, collection) {
    if (err) return logger.error(err.message);
    effected.forEach(function (group) {
      Feed.create({
        group: group._id,
        activity: activity._id
      }, function (err) {
        if (err) {
          logger.error(err.message);
        }
      });
    });
  });
}

Activity.prototype.group_activity = function group_activity(act, callback) {
  ActivitySchema.create(act, function (err, activity) {
    if (err) {
      callback(err, null);
      return;
    }
    //update own group
    let query = util.format(" MATCH (actor:group) \
                              where actor._id='%s'         \
                              return actor ", act.actor_group);
    run(query, function (err, group) {
      if (err) {
        return callback(err, null);
      }
      update_group_feeds(group, activity);

      //update following groups
      let query = util.format(" MATCH (actor:group)<-[:FOLLOW]-(effected:group) \
                              where actor._id='%s'         \
                              return effected ", act.actor_group);
      run(query, function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_group_feeds(effected, activity);
        callback(null, activity)
      });
    });
  });
};
*/

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

Activity.prototype.create = function create(act) {
  this.activity(act, function (err) {
    if (err) console.error(err.message)
  });
};

function activity_impl(act, callback) {
  ActivitySchema.create(act, function (err, activity) {
    if (err) {
      callback(err, null);
      return;
    }

    if(activity.audience && !_.includes(activity.audience, 'FOLLOWERS')) {
      update_feeds([], activity);
      return callback(null, activity)
    }

    if (activity.actor_user) {
      effected_in_rel(activity.actor_user, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_business) {
      effected_in_rel(activity.actor_business, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_mall) {
      effected_in_rel(activity.actor_mall, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_chain) {
      effected_in_rel(activity.actor_chain, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
    else if (activity.actor_group) {
      effected_in_rel(activity.actor_group, "FOLLOW", function (err, effected) {
        if (err) {
          return callback(err, null);
        }
        update_feeds(effected, activity);
        callback(null, activity)
      });
    }
  });
}

Activity.prototype.action_activity = function action_activity(userId, itemId, action) {
  let act = {
    actor_user: userId,
    action: action
  };
  utils.parallel_id(itemId, act, function (err, act) {
    if (err) {
      return callback(err, null)
    }
    activity_impl(act, function (err) {
      if (err) {
        logger.error(err.message)
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
  let query = util.format(" MATCH (actor)-[:%s]->(effected) \
                            where actor._id='%s' and actor <> effected \
                            return effected", relationship, actor_id);
  run(query, callback);
}

function effected_in_rel(actor_id, relationship, callback) {
  let query = util.format(" MATCH (actor)<-[:%s]-(effected) \
                            where actor._id='%s' and actor <> effected \
                            return effected", relationship, actor_id);
  run(query, callback);
}


module.exports = Activity;







