'use strict';

var _ = require('lodash');
var PhoneNumber = require('./phone_number.model');

// Get list of phone_numbers
exports.index = function(req, res) {
  PhoneNumber.find(function (err, phone_numbers) {
    if(err) { return handleError(res, err); }
    return res.json(200, phone_numbers);
  });
};

// Get a single phone_number
exports.show = function(req, res) {
  PhoneNumber.findById(req.params.id, function (err, phone_number) {
    if(err) { return handleError(res, err); }
    if(!phone_number) { return res.send(404); }
    return res.json(phone_number);
  });
};

// Creates a new phone_number in the DB.
exports.create = function(req, res) {
  PhoneNumber.create(req.body, function(err, phone_number) {
    if(err) { return handleError(res, err); }
    return res.json(201, phone_number);
  });
};

// Updates an existing phone_number in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  PhoneNumber.findById(req.params.id, function (err, phone_number) {
    if (err) { return handleError(res, err); }
    if(!phone_number) { return res.send(404); }
    var updated = _.merge(phone_number, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, phone_number);
    });
  });
};

// Deletes a phone_number from the DB.
exports.destroy = function(req, res) {
  PhoneNumber.findById(req.params.id, function (err, phone_number) {
    if(err) { return handleError(res, err); }
    if(!phone_number) { return res.send(404); }
    phone_number.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}