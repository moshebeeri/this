'use strict';

let _ = require('lodash');
let Group = require('./group.model');
let User = require('../user/user.model');
let Product = require('../product/product.model');
let Feed = require('../feed/feed.model');

let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('group');
let activity = require('../../components/activity').createActivity();
let logger = require('../../components/logger').createLogger();
let utils = require('../../components/utils').createUtils();
const async = require('async');

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
    return res.status(200).json(group);
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

function sendActivity(act) {
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });

}

function group_message_activity(group, user_id, message) {
  sendActivity({
    user: user_id,
    action: 'group_message',
    message: message.message,
    actor_group: group,
    audience: ['SELF']
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

// Creates a new group in the DB.
exports.create = function (req, res) {
  let group = req.body;
  group.creator = req.user._id;
  group.admins = [req.user._id];
  Group.create(group, function (err, group) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(group, to_graph(group), function (err) {
      if (err) {
        return handleError(res, err);
      }
      graphModel.relate_ids(group._id, 'CREATED_BY', req.user._id);
      graphModel.relate_ids(req.user._id, 'FOLLOW', group._id);
      graphModel.relate_ids(req.user._id, 'GROUP_ADMIN', group._id);
      if (group.entity_type === 'BUSINESS' && utils.defined(group.entity.business)) {
        graphModel.relate_ids(group._id, 'FOLLOW', group.entity.business);
      }
      group_activity(group, 'create');
    });
    return res.status(201).json(group);
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
  let query = `match (u:user{_id:'${req.user._id}'})-[r:FOLLOW]->(g:group{_id:'${req.params.group_id}'}) set r.timestamp=timestamp()`
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

exports.user_follow = function (req, res) {
  let skip = req.params.skip;
  let limit = req.params.limit;

  graphModel.query_objects(Group,
    `MATCH (u:user {_id:'${req.user._id}'})-[r:FOLLOW]->(g:group) RETURN g._id as _id`,
    'order by r.timestamp desc', skip, limit, function (err, groups) {
      if (err) return handleError(res, err);
      getGroupsLastInfo(groups, function (err, groups_previews) {
        if (err) return handleError(res, err);
        return res.status(200).json(groups_previews);
      });
    });
};


function getGroupPreview(group, callback) {

  Feed.findOne({entity: group._id})
    .where('message').eq(null)
    .sort({activity: 'desc'})
    .populate({
      path: 'user',
      select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'
    })
    .populate({path: 'activity'})
    .exec(function (err, act) {
      if (err) console.log(err.message);
      if (err) return callback(err);
      Feed.findOne({entity: group._id})
        .where('message').ne(null)
        .sort({activity: 'desc'})
        .populate({
          path: 'user',
          select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'
        })
        .populate({path: 'activity'})
        .exec(function (err, msg) {
          if (err) console.log(err.message);
          if (err) return callback(err);

          return callback(null, {
            act: act,
            msg: msg,
            group: group
          })
        })
    });


  // async.parallel({
  //   last_activity: function (callback) {
  //     console.log('last_activity');
  //
  //     Feed.findOne({entity: group._id})
  //       .where('message').eq(null)
  //       .sort({activity: 'desc'})
  //       .populate({path: 'user',
  //         select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'
  //       })
  //       .populate({path: 'activity'})
  //       .exec(function (err, act) {
  //         if(err) return callback(err);
  //         return callback(null, act)
  //       })
  //   },
  //   last_message: function (callback) {
  //     console.log('last_message');
  //     Feed.findOne({entity: group._id})
  //       .where('message').ne(null)
  //       .sort({activity: 'desc'})
  //       .populate({path: 'user',
  //         select: '-salt -hashedPassword -gid -role -__v -email -phone_number -sms_verified -sms_code -provider'
  //       })
  //       .populate({path: 'activity'})
  //       .exec(function (err, msg) {
  //         if(err) return callback(err);
  //         return callback(null, msg)
  //       })
  //   },
  //   group: function (callback) {
  //     console.log('group');
  //     return callback(null, group)
  //   },function (err, preview) {
  //     if(err) return callback(err);
  //     console.log(JSON.stringify(preview));
  //     return callback(null, preview)
  //   }
  // })
}

function getGroupsLastInfo(groups, callback) {
  let previews = [];
  async.each(groups, function (group, callback) {
    getGroupPreview(group, function (err, preview) {
      if (err) return callback(err);
      previews.push(preview);
      callback(null, preview)
    })
  }, function (err) {
    if (err) return callback(err);
    callback(null, previews);
  })
}

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

exports.ask_join_group = function (req, res) {
  let userId = req.user._id;
  let group = req.params.group;
  let query = `MATCH (u:user {_id:'${userId}'})-[r:ASK_JOIN_GROUP|FOLLOW]->(p:group{_id:"${group}"}) return r, type(r) as type`;
  graphModel.query(query, function (err, rs) {

    //check user is has not asked before
    //check user is not already member
    //check group policy
    //send req
    return res.status(200).json(rs);
  });
};

exports.approve_join_group = function (req, res) {
  //check auth user
  //check user asked join
  //add to group
  return res.status(200);
};

exports.ask_invite_group = function (req, res) {
  //check user is has not asked before
  //check user is not already member
  //check group policy
  //send req
  return res.status(200);
};

exports.approve_invite_group = function (req, res) {
  //check auth user
  //check use asked invite
  //add to group
  return res.status(200);
};

function handleError(res, err) {
  return res.status(500).send(err);
}
