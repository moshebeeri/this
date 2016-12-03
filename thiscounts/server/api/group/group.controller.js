'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('group');
var activity = require('../../components/activity').createActivity();
var logger = require('../../components/logger').createLogger();
var utils = require('../../components/utils').createUtils();

// Get list of groups
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
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
  var act = {
    group: group._id,
    action: action
  };
  if (group.creator_type == 'USER')
    act.actor_user = group.creator;
  else if (group.creator_type == 'CHAIN')
    act.actor_chain = group.creator;
  else if (group.creator_type == 'BUSINESS')
    act.actor_business = group.creator;
  else if (group.creator_type == 'MALL')
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

function user_activity(act){
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });

}

function group_offer_activity(group, offer){
  activity.group_activity({
    offer: offer,
    action: "group_offer",
    actor_group: group
  }, function (err) {
    if (err) logger.error(err.message)
  });
}

function group_message_activity(){

}

function group_follow_group_activity(following, followed) {
  user_activity({
    group: followed,
    action: "group_follow",
    actor_group: following
  });
}

// Creates a new group in the DB.
exports.create = function(req, res) {
	console.log("--------------------------------------------");
	console.log(req);
	console.log("--------------------------------------------");

	//req.body._id = req.body.id;

	/*var d = new Date();
  var n = d.getTime();
	console.log(n);

	req.body.created = Date.now();*/
	console.log(req.body);
	console.log("--------------------------------------------");
	console.log(req.user._id);
	console.log("--------------------------------------------");
	//req.body.pictures = [];
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(group, to_graph(group), function (err) {
      if (err) {  return handleError(res, err); }
			console.log('success');
      graphModel.relate_ids(group._id, 'CREATED_BY', req.user._id);
      group_activity(group, "create");
    });
    return res.json(201, group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// offer to group.
//router.post('/offer/:group', auth.isAuthenticated(), controller.offer);
exports.offer = function(req, res) {
  var offer = req.body;
  Group.findById(req.params.group, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
    graphModel.relate_ids(group._id, 'OFFER', offer._id);
    group_offer_activity(group, offer);
    return res.json(200, group);
  });
};

//router.post('/message/:group', auth.isAuthenticated(), controller.message);
exports.message = function(req, res) {
  Group.findById(req.params.group, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
    //var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      graphModel.relate_ids(group._id, 'CREATED_BY', req.user._id);
      group_message_activity(group);
      return res.json(200, group);
    });
  });
};

function user_follow_group(user_id, group, res){
  graphModel.relate_ids(user_id, 'FOLLOW', group._id);
  user_follow_group_activity(group, user_id);
  return res.json(200, group);
}

function group_follow_group(following_group_id, group_to_follow_id, res){
  graphModel.relate_ids(following_group_id, 'FOLLOW', group_to_follow_id);
  group_follow_group_activity(group, user_id);
  return res.json(200, group);
}

function add_user_to_group_admin(user_id, group, res){
	graphModel.relate_ids(user_id, 'GROUP_ADMIN', group._id);
  group.admins.push(user_id);
  Group.save(function (err) {
    if (err) { return handleError(res, err); }
    return res.json(200, group);
  });
}

exports.add_admin = function(req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
    //if requester is group admin he may add admins
    if(utils.defined(_.find(group.admins, req.user._id))) {
      user_follow_group(req.user._id, group, function(err, group){
        add_user_to_group_admin(req.user._id, group)
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
exports.add_user = function(req, res) {
	Group.findById(req.params.to_group, function (err, group) {
		if(err) { return handleError(res, err); }
		if(!group) { return res.status(404).send('no group'); }

		if(group.add_policy == 'OPEN'){
			if(req.user._id ==  req.params.user )
				return user_follow_group(req.user._id, group, res);
			else
				return res.status(404).send('Group add policy OPEN - authenticated user may only add himself');
		}
		if(group.add_policy == 'CLOSE'){
			if(utils.defined(_.find(group.admins, req.user._id)))
				return user_follow_group(req.user._id, group, res);
			else
				return res.status(404).send('Group add policy CLOSE - only admin may add users');
		}
		if(group.add_policy == 'REQUEST' ||
			group.add_policy == 'ADMIN_INVITE' ||
			group.add_policy == 'MEMBER_INVITE' )
			return handleError(res, 'add policy ' + group.add_policy + ' not implemented');
	});
};

//router.get('/add/users/:to_group', auth.isAuthenticated(), controller.add_users);
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
exports.add_users = function(req, res) {
	Group.findById(req.params.to_group, function (err, group) {
		if(err) { return handleError(res, err); }
		if(!group) { return res.status(404).send('no group'); }

    if(utils.defined(_.find(group.admins, req.user._id) && (group.add_policy == 'OPEN' || group.add_policy == 'CLOSE'))){
      for(var user in req.body.users) {
        user_follow_group(user, group, res);
      }
    }
    else if(group.add_policy == 'REQUEST' || group.add_policy == 'ADMIN_INVITE' || group.add_policy == 'MEMBER_INVITE' )
      return handleError(res, 'add policy ' + group.add_policy + ' not implemented');
    else
      return res.status(404).send('Can not add users');
	});
};

//router.get('/add/:group/:to_group', auth.isAuthenticated(), controller.add_group);
exports.add_group = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('no group'); }
    //user must be one of the admins
    if(utils.defined(_.find(group.admins, req.user._id)))
      return group_follow_group(req.user._id, group, res);
    else
      return res.status(404).send('Only group admin may follow other groups');
  });
};

//router.get('/add/:group/:to_group', auth.isAuthenticated(), controller.add_group);
exports.members = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    //user must be one of the admins
    if(utils.defined(_.find(group.admins, req.user._id)))
      return group_follow_group(req.params.group, group, res);
    else
      return res.send(404, 'Only group admin may follow other groups');
  });
};

exports.following_groups = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var skip = req.params.skip;
    var limit = req.params.limit;
    graphModel.incoming_ids(req.params.group, 'FOLLOW', 'group', 'in', skip, limit, function (err, following) {
      if (err) {return handleError(res, err)}
      Group.find({}).where('_id').in(following).exec(function (err, following_groups) {
        if (err) {return handleError(res, err)}
        return res.status(200).json(following_groups);
      });
    });
  });
};

exports.following_users = function (req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var skip = req.params.skip;
    var limit = req.params.limit;
    graphModel.incoming_ids(req.params.group, 'FOLLOW', 'user', 'in', skip, limit, function (err, following) {
      if (err) {return handleError(res, err)}
      User.find({}).where('_id').in(following).exec(function (err, following_users) {
        if (err) {return handleError(res, err)}
        return res.status(200).json(following_users);
      });
    });
  });
};


function handleError(res, err) {
  //return res.send(500, err);
  return res.status(500).send(err);
}
