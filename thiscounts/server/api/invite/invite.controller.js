'use strict';

let _ = require('lodash');
let Invite = require('./invite.model.js');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('invite');

// Get list of invites
exports.index = function(req, res) {
  Invite.find(function (err, invites) {
    if(err) { return handleError(res, err); }
    return res.json(200, invites);
  });
};

// Get a single invite
exports.show = function(req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if(err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    return res.json(invite);
  });
};

// Creates a new invite in the DB.
exports.create = function(req, res) {
  Invite.create(req.body, function(err, invite) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(invite, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.json(201, invite);
  });
};

// Updates an existing invite in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invite.findById(req.params.id, function (err, invite) {
    if (err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    let updated = _.merge(invite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, invite);
    });
  });
};

// Deletes a invite from the DB.
exports.destroy = function(req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if(err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    invite.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.invite_user = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invite.findById(req.params.id, function (err, invite) {
    if (err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    let updated = _.merge(invite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, invite);
    });
  });
};

exports.invite_group = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invite.findById(req.params.id, function (err, invite) {
    if (err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    let updated = _.merge(invite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, invite);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
