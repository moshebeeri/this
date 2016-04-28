'use strict';

var _ = require('lodash');
var Group = require('./group.model');
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
    if(!group) { return res.send(404); }
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

function group_created_activity(group) {
  var act = {
    group: group._id,
    action: "created"
  };
  if (group.creator_type == 'USER')
    act.actor_user = group.creator;
  if (group.creator_type == 'CHAIN')
    act.actor_chain = group.creator;
  if (group.creator_type == 'BUSINESS')
    act.actor_business = group.creator;
  if (group.creator_type == 'MALL')
    act.actor_mall = group.creator;

  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });
}

function group_join_activity(group, user) {
  var act = {
    group: group._id,
    action: "group_join",
    user: user_id
  };
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });
}

// Creates a new group in the DB.
exports.create = function(req, res) {
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(group, to_graph(group), function (err) {
      if (err) {  return handleError(res, err); }
      graphModel.relate_ids(group._id, 'CREATED_BY', req.body._id);
      group_created_activity(group);
    });
    return res.json(201, group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
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
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function add_user_to_group(user, group, res){
  graphModel.relate_ids(user._id, 'GROUP_MEMBER', group._id);
  group_join_activity(group, user);
  return res.json(200, group);
}

function add_user_to_group_admin(user, group, res){
  graphModel.relate_ids(user._id, 'GROUP_MEMBER', group._id);
  group.admins.push(user._id);
  Group.save(function (err) {
    if (err) { return handleError(res, err); }
    return res.json(200, group);
  });
}

exports.add_admin = function(req, res) {
  Group.findById(req.params.to_group, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    if(utils.defined(_.find(group.admins, req.user._id))) {
      add_user_to_group(user, group, function(err, group){
        add_user_to_group_admin(user, group)
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
    if(!group) { return res.send(404); }
      if(group.add_policy == 'OPEN'){
        if(req.user._id ==  req.params.user )
          return add_user_to_group(user, group, res);
        else
          return res.send(404, 'Group add policy OPEN - authenticated user may only add himself');
      }
      if(group.add_policy == 'CLOSE'){
        if(utils.defined(_.find(group.admins, req.user._id)))
          return add_user_to_group(user, group, res);
        else
          return res.send(404, 'Group add policy CLOSE - only admin may add users');
      }
      if(group.add_policy == 'REQUEST' ||
        group.add_policy == 'ADMIN_INVITE' ||
        group.add_policy == 'MEMBER_INVITE' )
        return handleError(res, 'add policy ' + group.add_policy + ' not implemented');
  });
};

//router.get('/add/:group/:to_group', auth.isAuthenticated(), controller.add_group);
exports.add_group = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
}
