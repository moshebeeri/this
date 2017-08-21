'use strict';

const _ = require('lodash');
const Activity = require('./activity.model');
let activity = require('../../components/activity').createActivity();
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('activity');
let MongodbSearch = require('../../components/mongo-search');

// Get list of activities
exports.index = function(req, res) {
  Activity.find(function (err, activitys) {
    if(err) { return handleError(res, err); }
    return res.json(200, activitys);
  });
};

// Get a single activity
exports.show = function(req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if(err) { return handleError(res, err); }
    if(!activity) { return res.send(404); }
    return res.json(activity);
  });
};

// Creates a new activity in the DB.
exports.create = function(req, res) {
  Activity.create(req.body, function(err, activity) {
    if(err) { return handleError(res, err); }
    return res.json(201, activity);
  });
};

// Updates an existing activity in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Activity.findById(req.params.id, function (err, activity) {
    if (err) { return handleError(res, err); }
    if(!activity) { return res.send(404); }
    let updated = _.merge(activity, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, activity);
    });
  });
};

// Deletes a activity from the DB.
exports.destroy = function(req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if(err) { return handleError(res, err); }
    if(!activity) { return res.send(404); }
    activity.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.share = function(req, res) {
  let act = {
    activity: req.params.activity,
    ids: [req.params.user],
    action: 'share',
    sharable : false
  };
  act.actor_user = req.user._id;
  activity.create(act);
  graphModel.relate_ids(req.user._id, 'SHARE', req.params.activity);
  return res.json(200, activity);
};

function handleError(res, err) {
  return res.send(500, err);
}
