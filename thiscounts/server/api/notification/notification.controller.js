'use strict';

let _ = require('lodash');
let Notification = require('./notification.model');

// Get list of notifications
exports.find = function(req, res) {
  //TODO: Validate authorization
  Notification.find({to: req.params.entity_id})
    .skip(req.params.skip)
    .limit(req.params.limit)
    .exec(function (err, notifications) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(notifications);
  });
};

// Get list of notifications
exports.index = function(req, res) {
  Notification.find(function (err, notifications) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(notifications);
  });
};

// Get a single notification
exports.show = function(req, res) {
  Notification.findById(req.params.id, function (err, notification) {
    if(err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    return res.status(200).json(notification);
  });
};

// Creates a new notification in the DB.
exports.create = function(req, res) {
  let notification = req.body;
  notification.timestamp = Date.now();
  Notification.create(notification, function(err, notification) {
    if(err) { return handleError(res, err); }
    return res.json(201, notification);
  });
};

// Updates an existing notification in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Notification.findById(req.params.id, function (err, notification) {
    if (err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    let updated = _.merge(notification, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(notification)
    });
  });
};

exports.read = function(req, res) {
  Notification.findById(req.params.id, function (err, notification) {
    if (err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    notification.read = true;
    notification.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(notification)
    });
  });
};

exports.action = function(req, res) {
  Notification.findById(req.params.id, function (err, notification) {
    if (err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    notification.read = true;
    notification.action = true;
    notification.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(notification)
    });
  });
};

// Deletes a notification from the DB.
exports.destroy = function(req, res) {
  Notification.findById(req.params.id, function (err, notification) {
    if(err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    notification.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
