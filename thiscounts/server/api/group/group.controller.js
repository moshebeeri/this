'use strict';

let _ = require('lodash');
let Group = require('./group.model');
let User = require('../user/user.model');

let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('group');
let activity = require('../../components/activity').createActivity();
let logger = require('../../components/logger').createLogger();
let utils = require('../../components/utils').createUtils();

// Get list of groups
exports.index = function (req, res) {
  Group.find(function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, groups);
  });
};

// Get a single group
exports.show = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    return res.json(group);
  });
};

function to_graph(group) {
  return {
    _id: group._id,
    name: group.name,
    created: group.created
  }
}

function group_activity(group, action) {
  const act = {
    group: group._id,
    action: action
  };
  if (group.entity_type === 'USER')
    act.actor_user = group.creator;
  else if (group.entity_type === 'CHAIN')
    act.actor_chain = group.creator;
  else if (group.entity_type === 'BUSINESS')
    act.actor_business = group.creator;
  else if (group.entity_type === 'MALL')
    act.actor_mall = group.creator;
  user_activity(act);
}

function user_follow_group_activity(group, user) {
  user_activity({
    group: group,
    action: "group_follow",
    actor_user: user
  });
}

function user_activity(act) {
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });

}

function group_offer_activity(group, offer) {
  activity.group_activity({
    offer: offer,
    action: "group_offer",
    actor_group: group
  }, function (err) {
    if (err) logger.error(err.message)
  });
}

function group_message_activity() {

}

function group_follow_group_activity(following, followed) {
  user_activity({
    group: followed,
    action: "group_follow",
    actor_group: following
  });
}

// Creates a new group in the DB.
exports.create = function (req, res) {
  let group = req.body;
  group.creator = req.user._id;
  Group.create(group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(group, to_graph(group), function (err) {
      if (err) {
        return handleError(res, err);
      }
      console.log('success');
      graphModel.relate_ids(group._id, 'CREATED_BY', req.user._id);
      graphModel.relate_ids(req.user._id, 'FOLLOW', group._id);
      graphModel.relate_ids(req.user._id, 'GROUP_ADMIN', group._id);
      if (utils.defined(req.body.business_id)) {
        graphModel.relate_ids(group._id, 'FOLLOW', req.body.business_id);
      }

      group_activity(group, "create");
    });
    return res.json(201, group);
  });
};

exports.create_business_default_group = function (group, callback) {
  Group.create(group, function (err, group) {
    if (err) {
      return callback(err);
    }
    graphModel.reflect(group, {
      _id: group._id,
      default: true,
      created: group.created
    }, function (err) {
      if (err) return callback(err);
      graphModel.relate_ids(group._id, 'CREATED_BY', group.creator);
      graphModel.relate_ids(group.creator, 'FOLLOW', group._id);
      graphModel.relate_ids(group.creator, 'GROUP_ADMIN', group._id);
      graphModel.relate_ids(group.entity, 'HAS_GROUP', group._id, function (err) {
        if (err) return console.log(err);
        return callback(null, group);
      });
    });
  });
};

// Updates an existing group in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    let updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    group.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

// offer to group.
//router.post('/offer/:group', auth.isAuthenticated(), controller.offer);
exports.offer = function (req, res) {
  let offer = req.body;
  Group.findById(req.params.group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    graphModel.relate_ids(group._id, 'OFFER', offer._id);
    group_offer_activity(group, offer);
    return res.json(200, group);
  });
};

//router.post('/message/:group', auth.isAuthenticated(), controller.message);
exports.message = function (req, res) {
  Group.findById(req.params.group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    //var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      graphModel.relate_ids(group._id, 'CREATED_BY', req.user._id);
      group_message_activity(group);
      return res.json(200, group);
    });
  });
};

function user_follow_group(user_id, group, isReturn, res) {
  graphModel.relate_ids(user_id, 'FOLLOW', group._id, {timestamp: Date.now()});
  user_follow_group_activity(group, user_id);
  if (isReturn) {
    return res.json(200, group);
  }
}

function group_follow_group(following_group_id, group_to_follow_id, res) {
  graphModel.relate_ids(following_group_id, 'FOLLOW', group_to_follow_id);
  group_follow_group_activity(group, user_id);
  return res.json(200, group);
}

function add_user_to_group_admin(user_id, group, isReturn, res) {
  graphModel.relate_ids(user_id, 'GROUP_ADMIN', group._id);
  group.admins.push(user_id);
  Group.save(function (err) {
    if (err) {
      return handleError(res, err);
    }
    if (isReturn) {
      return res.json(200, group);
    }
  });
}

exports.add_admin = function (req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    //if requester is group admin he may add admins
    if (utils.defined(_.find(group.admins, req.user._id))) {
      user_follow_group(req.user._id, group, true, function (err, group) {
        add_user_to_group_admin(req.user._id, group, true)
      });
    }
  });
};

//router.get('/add/:user/:to_group', auth.isAuthenticated(), controller.add_user);
// add_policy: {
//   type: String,
//     required : true,
// enum: [
//     'OPEN',         //  any one can add himself
//     'CLOSE',        //  only admin adds
//     'REQUEST',      //  anyone can request to be added
//     'ADMIN_INVITE', //  admin invite
//     'MEMBER_INVITE' //  member invite
//   ]
// },
exports.add_user = function (req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }

    if (group.add_policy === 'OPEN') {
      if (req.user._id === req.params.user)
        return user_follow_group(req.user._id, group, true, res);
      else
        return res.status(404).send('Group add policy OPEN - authenticated user may only add himself');
    }
    if (group.add_policy === 'CLOSE') {
      if (utils.defined(_.find(group.admins, req.user._id)))
        return user_follow_group(req.user._id, group, true, res);
      else
        return res.status(404).send('Group add policy CLOSE - only admin may add users');
    }
    if (group.add_policy === 'REQUEST' ||
      group.add_policy === 'ADMIN_INVITE' ||
      group.add_policy === 'MEMBER_INVITE')
      return handleError(res, 'add policy ' + group.add_policy + ' not implemented');
  });
};

exports.add_users = function (req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }

    if (utils.defined(_.find(group.admins, req.user._id) && (group.add_policy === 'OPEN' || group.add_policy === 'CLOSE'))) {

      for (let user in req.body.users) {
        if (!req.body.users.hasOwnProperty(user))
          continue;
        console.log(req.body.users[user]);
        if (user !== Object.keys(req.body.users)[Object.keys(req.body.users).length - 1]) {
          user_follow_group(req.body.users[user], group, false, res);
        } else {
          user_follow_group(req.body.users[user], group, true, res);
        }
      }
    }
    else if (group.add_policy === 'REQUEST' || group.add_policy === 'ADMIN_INVITE' || group.add_policy === 'MEMBER_INVITE')
      return handleError(res, 'add policy ' + group.add_policy + ' not implemented');
    else
      return res.status(404).send('Can not add users');
  });
};

exports.add_group = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    //user must be one of the admins
    if (utils.defined(_.find(group.admins, req.user._id)))
      return group_follow_group(req.user._id, group, res);
    else
      return res.status(404).send('Only group admin may follow other groups');
  });
};

exports.following = function (req, res) {
  let group = req.params.group;
  let skip = req.params.skip;
  let limit = req.params.limit;

  graphModel.query_objects([Group, User],
    `MATCH (g:group {_id:'${group}'})<-[r:FOLLOW]-(g:group)
     OPTIONAL MATCH (g:group {_id:'${group}'})<-[r:FOLLOW]-(u:user) 
     RETURN g._id as gid, u._id as uid`,
    '', skip, limit, function (err, table) {
      if (err) return handleError(res, err);
      return res.status(200).json(table);
    });
};

exports.following_groups = function (req, res) {
  let group = req.params.group;
  let skip = req.params.skip;
  let limit = req.params.limit;

  graphModel.query_objects(Group,
    `MATCH (g:group {_id:'${group}'})<-[r:FOLLOW]-(g:group) RETURN g._id as _id`,
    '', skip, limit, function (err, groups) {
      if (err) return handleError(res, err);
      return res.status(200).json(groups);
    });
};

exports.following_users = function (req, res) {
  let group = req.params.group;
  let skip = req.params.skip;
  let limit = req.params.limit;

  graphModel.query_objects(User,
    `MATCH (g:group {_id:'${group}'})<-[r:FOLLOW]-(u:user) RETURN u._id as _id`,
    '', skip, limit, function (err, users) {
      if (err) return handleError(res, err);
      return res.status(200).json(users);
    });
};

exports.my_groups = function (req, res) {
  let userId = req.user._id;
  let skip = req.params.skip;
  let limit = req.params.limit;

  graphModel.query_objects(Group,
    `MATCH (u:user {_id:'${userId}'})-[r:FOLLOW]->(g:group) RETURN g._id as _id`,
    'order by p.created DESC', skip, limit, function (err, products) {
      if (err) return handleError(res, err);
      return res.status(200).json(products);
    });
};

exports.user_products = function (req, res) {
  let userID = req.user._id;
  console.log(userID);
  let skip = req.params.skip;
  let limit = req.params.limit;
  graphModel.query_objects(Product,
    `MATCH (u:user {_id:'${userID}'})<-[r:CREATED_BY]-(p:product) RETURN p._id as _id`,
    'order by p.created DESC', skip, limit, function (err, products) {
      if (err) return handleError(res, err);
      return res.status(200).json(products);
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
