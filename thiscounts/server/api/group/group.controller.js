'use strict';

const _ = require('lodash');
const Group = require('./group.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');
const Notifications = require('../../components/notification');

const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('group');
const activity = require('../../components/activity').createActivity();
const utils = require('../../components/utils').createUtils();
const MongodbSearch = require('../../components/mongo-search');
const qrcodeController = require('../qrcode/qrcode.controller');
const onAction = require('../../components/on-action');
const feed = require('../../components/feed-tools');

exports.search = MongodbSearch.create(Group);

// Get list of groups
exports.index = function (req, res) {
  Group.find(function (err, groups) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(groups);
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
    get_groups_state([group], req.user._id, function (err, groups) {
      return res.status(200).json(groups[0]);
    });
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
  sendActivity(act);
}

function user_follow_group_activity(group, user) {
  sendActivity({
    user: user,
    action: "group_follow",
    actor_group: group,
    audience: ['SELF']
  });
}

function sendActivity(act, callback) {
  activity.activity(act, function (err, activity) {
    if (err) return callback(err);
    callback(null, activity)
  });

}

function group_message_activity(group, user_id, message) {
  sendActivity({
    user: user_id,
    action: 'group_message',
    message: message.message,
    actor_group: group,
    audience: ['SELF']
  }, function (err, activity) {
    group.preview.message_activity = activity._id;
    group.save();
  });
}

function group_follow_group_activity(following, followed) {
  sendActivity({
    group: followed,
    action: "group_follow",
    actor_group: following,
    audience: ['SELF', 'FOLLOWERS']
  });
}

function group_follow_business_activity(following, followed) {
  sendActivity({
    business: followed,
    action: "group_follow",
    actor_group: following,
    audience: ['SELF', 'FOLLOWERS']
  });
}

function notifyOnAction(group) {
  Notifications.notify( {
    note: 'ADD_GROUP_FOLLOW_ON_ACTION',
    group: group.id,
    actor_user: group.creator
  },[group.creator])
}

// Creates a new group in the DB.
exports.create = function (req, res) {
  let group = req.body;
  group.creator = req.user._id;
  group.admins = [req.user._id];
  Group.create(group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    qrcodeController.createAndAssign(group.creator, {
      type: 'FOLLOW_GROUP',
      entities: {
        group: group._id
      }
    }, function (err, qrcode) {
      group.qrcode = qrcode;
      group.save();
      graphModel.reflect(group, to_graph(group), function (err) {
        if (err) {
          return handleError(res, err);``
        }
        graphModel.relate_ids(group._id, 'CREATED_BY', req.user._id);
        graphModel.relate_ids(req.user._id, 'FOLLOW', group._id);
        graphModel.relate_ids(req.user._id, 'GROUP_ADMIN', group._id);
        if (group.entity_type === 'BUSINESS' && utils.defined(group.entity.business)) {
          graphModel.relate_ids(group._id, 'FOLLOW', group.entity.business);
          graphModel.relate_ids(group.entity.business, 'BUSINESS_GROUP', group._id);
        }
        group_activity(group, 'create');
        notifyOnAction(group);
      });
      return res.status(201).json(group);
    });
  });
};

exports.create_business_default_group = function (group, callback) {
  Group.create(group, function (err, group) {
    if (err) {
      return callback(err);
    }
    qrcodeController.createAndAssign(group.creator, {
      type: 'FOLLOW_GROUP',
      entities: {
        group: group._id
      }
    }, function (err, qrcode) {
      group.qrcode = qrcode;
      group.save();
      graphModel.reflect(group, {
        _id: group._id,
        default: true,
        created: group.created
      }, function (err) {
        if (err) return callback(err);
        graphModel.relate_ids(group._id, 'CREATED_BY', group.creator);
        graphModel.relate_ids(group.creator, 'FOLLOW', group._id);
        graphModel.relate_ids(group.creator, 'GROUP_ADMIN', group._id);
        graphModel.relate_ids(group._id, 'FOLLOW', group.entity.business);
        graphModel.relate_ids(group.entity.business, 'DEFAULT_GROUP', group._id, function (err) {
          if (err) return callback(err);
          return callback(null, group);
        });
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
      return res.status(200).json(group);
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
// exports.offer = function (req, res) {
//   let offer = req.body;
//   Group.findById(req.params.group, function (err, group) {
//     if (err) {
//       return handleError(res, err);
//     }
//     if (!group) {
//       return res.status(404).send('no group');
//     }
//     graphModel.relate_ids(group._id, 'OFFER', offer._id);
//     group_offer_activity(group, offer);
//     return res.status(200).json(group);
//   });
// };

//router.post('/message/:group', auth.isAuthenticated(), controller.message);
exports.message = function (req, res) {
  Group.findById(req.params.group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('no group');
    }
    group_message_activity(group, req.user._id, req.body);
    return res.status(200).json(group);
  });
};

exports.touch = function (req, res) {
  let query = `match (u:user{_id:'${req.user._id}'})-[r:FOLLOW]->(g:group{_id:'${req.params.group_id}'}) set r.timestamp=timestamp()`;
  graphModel.query(query, function (err) {
    if (err) console.error(err.message);
  });
  return res.status(200);
};

function user_follow_group(user_id, group, callback) {
  graphModel.relate_ids(user_id, 'FOLLOW', group._id, {timestamp: Date.now()}, function (err) {
    if (err) {
      console.error(err);
    }
    user_follow_group_activity(group, user_id);
    onAction.follow(user_id, group._id);

    if (typeof callback === 'function')
      callback(null, group);
  });
}

function group_follow_group(following_group_id, group_to_follow_id, callback) {
  graphModel.relate_ids(following_group_id, 'FOLLOW', group_to_follow_id, function (err) {
    if (err) return callback(err);
    group_follow_group_activity(following_group_id, group_to_follow_id);
    callback(null)
  });
}

function group_follow_business(following_group_id, business_id, callback) {
  graphModel.relate_ids(following_group_id, 'FOLLOW', business_id, function (err) {
    if (err) return callback(err);
    group_follow_business_activity(business_id, following_group_id);
    callback(null)
  });
}

function add_user_to_group_admin(user_id, group, callback) {
  graphModel.relate_ids(user_id, 'GROUP_ADMIN', group._id);
  group.admins.push(user_id);
  Group.save(function (err, group) {
    if (err) {
      return callback(err)
    }
    callback(null, group)
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
      handleError(res, new Error('only group admin can add admin'))
    }
    graphModel.is_related_ids(req.params.user, 'FOLLOW', group._id, function (err, exist) {
      if (!exist) {
        handleError(res, new Error('only group members can be added to admin'))
      }
      add_user_to_group_admin(req.user._id, group, function (err, group) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(group);
      })
    });
  });
};

function non_commercial_group(group) {
  return utils.defined(group.entity.user) &&
    utils.undefined(group.entity.business) &&
    utils.undefined(group.entity.shopping_chain) &&
    utils.undefined(group.entity.mall);
}

exports.add_user = function (req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('group not found');
    }
    //TODO: remove remark, temporary allowed for dev
    //if (!(_.find(group.admins, req.user._id) && non_commercial_group(group))) {
    //  return res.status(404).send('Not Authorized');
    user_follow_group(req.params.user, group, true, res);
    return res.status(201).json(group);
  });
};

exports.add_users = function (req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('group not found');
    }
    //TODO: remove remark, temporary allowed for dev
    //if (!(_.find(group.admins, req.user._id) && non_commercial_group(group))) {
    //  return res.status(404).send('Not Authorized');
    for (let user in req.body.users) {
      if (req.body.users.hasOwnProperty(user)) {
        user_follow_group(req.body.users[user], group);
      }
    }
    return res.status(201).send('users added');
  });
};

exports.join_group = function (req, res) {
  Group.findById(req.params.group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    if (!group) {
      return res.status(404).send('source group not found');
    }

    if (group.add_policy !== 'OPEN')
      return res.status(404).send('Group you try to follow is not open');

    user_follow_group(req.user._id, group, function (err) {
      if (err) return handleError(res, err);
      return res.status(200).json(group);
    });
  })
};

exports.group_join_group = function (req, res) {
  Group.findById(req.params.group, function (err, following_group) {
    if (err) {
      return handleError(res, err);
    }
    if (!following_group) {
      return res.status(404).send('source group not found');
    }

    //user must be one of the admins
    if (!utils.defined(_.find(following_group.admins, req.user._id)))
      return res.status(404).send('Only group admin may follow other groups');

    Group.findById(req.params.group2follow, function (err, group2follow) {
      if (group2follow.add_policy !== 'OPEN')
        return res.status(404).send('Group you try to follow is not open');

      group_follow_group(following_group._id, group2follow._id, function (err) {
        if (err) return handleError(res, err);
        return res.status(200).json(following_group);
      });
    })
  });
};

exports.group_follow_business = function (req, res) {
  Group.findById(req.params.group, function (err, following_group) {
    if (err) {
      return handleError(res, err);
    }
    if (!following_group) {
      return res.status(404).send('source group not found');
    }

    //user must be one of the admins
    if (!utils.defined(_.find(following_group.admins, req.user._id)))
      return res.status(404).send('Only group admin may follow other groups');

    group_follow_business(following_group._id, req.params.business, function (err) {
      if (err) return handleError(res, err);
      return res.status(200).json(following_group);
    });
  })
};

exports.groups_following_business = function (req, res) {
  let skip = req.params.skip;
  let limit = req.params.limit;

  let query = `MATCH (g:group)-[:FOLLOW]->(b:business{_id:"${req.params.business}"}) RETURN g._id as _id`;
  graphModel.query_objects(Group, query, 'order by r.timestamp desc', skip, limit, function (err, groups) {
    if (err) return handleError(res, err);
    return res.status(200).json(groups);
  })
};

exports.test_add_user = function (req, res) {
  return res.status(200).json("tested");
};

exports.following = function (req, res) {
  let group = req.params.group;
  let skip = req.params.skip;
  let limit = req.params.limit;
  let query = graphModel.paginate_query(`MATCH (g:group {_id:'${group}'})<-[r:FOLLOW]-(g:group)
     OPTIONAL MATCH (g:group {_id:'${group}'})<-[r:FOLLOW]-(u:user) 
     RETURN g._id as gid, u._id as uid`, skip, limit);
  graphModel.query_objects_parallel({gid: Group, uid: User}, query,
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
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
      get_groups_state(groups, req.user._id, function (err, groups) {
        return res.status(200).json(groups);
      });
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

function get_groups_state(groups, userId, callback){
  feed.generate_state(groups, userId, feed.group_state, callback)
}


exports.user_follow = function (req, res) {
  let skip = req.params.skip;
  let limit = req.params.limit;
  const query = `MATCH (u:user {_id:'${req.user._id}'})-[r:FOLLOW]->(g:group) 
                        OPTIONAL MATCH (u)-[role:ROLE]->(:business)-[:DEFAULT_GROUP|BUSINESS_GROUP]->(g)
                        RETURN g._id as _id, r.timestamp as touched, role.name AS role`;
  graphModel.query_ids(query,
    'order by r.timestamp desc', skip, limit, function(err, gObjects) {
      let _ids = [];
      let id2touch = {};

      gObjects.forEach(gObject => {
        _ids.push(gObject._id);
        id2touch[gObject._id] = {touched: gObject.touched, role: gObject.role}
      });
      if (err) return handleError(res, err);

      Group.find({})
        .where('_id').in(_ids)
        .populate('preview.message_activity')
        .populate('preview.instance_activity')
        .exec(function (err, groups) {
          if (err) return handleError(res, err);
          get_groups_state(groups, req.user._id, function (err, groups) {
            groups.forEach(group => {
              group.touched = id2touch[group._id].touched;
              group.role = id2touch[group._id].role;
            });
          });
        return res.status(200).json(groups);
    });
  });
};

exports.user_products = function (req, res) {
  let userID = req.user._id;
  let skip = req.params.skip;
  let limit = req.params.limit;
  graphModel.query_objects(Product,
    `MATCH (u:user {_id:'${userID}'})<-[r:CREATED_BY]-(p:product) RETURN p._id as _id`,
    'order by p.created DESC', skip, limit, function (err, products) {
      if (err) return handleError(res, err);
      return res.status(200).json(products);
    });
};

function sendGroupNotification(actor_user, audience, group_id, type) {
  let note = {
    note: type,
    group: group_id,
    actor_user: actor_user
  };
  Notifications.notify(note, audience);
}

exports.ask_join_group = function (req, res) {
  let userId = req.user._id;
  let group = req.params.group;
  let query = `MATCH (u:user {_id:'${userId}'})-[r:ASK_JOIN_GROUP|FOLLOW|GROUP_ADMIN]->(g:group{_id:"${group}"}) return r, type(r) as type`;
  graphModel.query(query, function (err, rs) {
    if(err) return handleError(res, err);
    if(rs.length > 0)
      return res.status(201).json(rs);
    Group.findById(group, function (err, group) {
      if (err) return handleError(res, err);
      if (!group) return res.status(404).send('no group');
      if(group.add_policy === 'OPEN')
        user_follow_group(userId, group, function (err) {
          if (err) return handleError(res, err);
          return res.status(200).json(group);
        });

      if(group.add_policy !== 'REQUEST')
        return res.status(404).send('group.add_policy miss match');

      let create = `MATCH (g:group{_id:'${group}'})
                    CREATE (u:user{_id:'${userId}'})-[a:ASK_JOIN_GROUP]->(g)`;
      graphModel.query(create, function (err) {
        if(err) return handleError(res, err);
        sendGroupNotification(userId, group.admins, group._id, 'ask_join');
        return res.status(200).json(group);
      })
    });
  });
};

exports.approve_join_group = function (req, res) {
  let userId = req.user._id;
  let group = req.params.group;
  let user = req.params.user;

  Group.findById(group, function (err, group) {
    if (err) return handleError(res, err);
    if (!group) return res.status(404).send('no group');
    if(!group.admins.includes(userId))
      return res.status(401).send('unauthorized');
    user_follow_group(userId, group, function(err){
      if(err) return handleError(res, err);
      graphModel.unrelate_ids(user, 'ASK_JOIN_GROUP', group);
      sendGroupNotification(userId, [user], group._id, 'approve_join');
      return res.status(200).json(group);
    });
  });
};

exports.invite_group = function (req, res) {
  let userId = req.user._id;
  let group = req.params.group;
  let user = req.params.user;

  function invite(){
    let create = `MATCH (g:group{_id:"${group}"}), (u:user {_id:'${user}'})
                  CREATE UNIQUE (u)-[:INVITE_GROUP]->(g)`;
    graphModel.query(create, function (err) {
      if(err) return handleError(res, err);
      sendGroupNotification(userId, [user], group, 'ask_invite');
      return res.status(200).json(group);
    })
  }

  Group.findById(group, function (err, group) {
    if (err) return handleError(res, err);
    if (!group) return res.status(404).send('no group');
    if(group.admins.indexOf(userId) > -1)
      return invite();
    else if(group.add_policy === 'MEMBER_INVITE' ){
      let query = `MATCH (u:user {_id:'${userId}'})-[r:FOLLOW]->(g:group{_id:"${group}"}) return r`;
      graphModel.query(query, function (err, rs) {
        if (err) return handleError(res, err);
        if (rs.length === 0)
          return res.status(404).send('user can not invite');
        return invite();
      })
    }else{
      return res.status(401).send('unauthorized');
    }
  });
};

exports.approve_invite_group = function (req, res) {
  let userId = req.user._id;
  let group = req.params.group;

  let query = `MATCH (u:user {_id:'${userId}'})-[r:INVITE_GROUP]->(g:group{_id:"${group}"}) return r, type(r) as type`;
  graphModel.query(query, function (err, rs) {
    if(err) return handleError(res, err);
    if(rs.length === 0)
      return res.status(404).send('user not invited');
    user_follow_group(userId, {_id:group}, function(err){
      if(err) return handleError(res, err);
      graphModel.unrelate_ids(userId, 'INVITE_GROUP', group);
      sendGroupNotification(userId, [userId], group, 'approve_invite');
      return res.status(200).json(group);
    })
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
