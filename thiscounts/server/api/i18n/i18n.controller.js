'use strict';

let _ = require('lodash');
let I18n = require('./i18n.model.js');

// Get list of i18ns
exports.index = function(req, res) {
  I18n.find(function (err, i18ns) {
    if(err) { return handleError(res, err); }
    return res.json(200, i18ns);
  });
};

// Get a single i18n
exports.show = function(req, res) {
  I18n.findById(req.params.id, function (err, i18n) {
    if(err) { return handleError(res, err); }
    if(!i18n) { return res.send(404); }
    return res.json(i18n);
  });
};

// Creates a new i18n in the DB.
exports.create = function(req, res) {
  I18n.create(req.body, function(err, i18n) {
    if(err) { return handleError(res, err); }
    return res.json(201, i18n);
  });
};

// Updates an existing i18n in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  I18n.findById(req.params.id, function (err, i18n) {
    if (err) { return handleError(res, err); }
    if(!i18n) { return res.send(404); }
    let updated = _.merge(i18n, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, i18n);
    });
  });
};

// Deletes a i18n from the DB.
exports.destroy = function(req, res) {
  I18n.findById(req.params.id, function (err, i18n) {
    if(err) { return handleError(res, err); }
    if(!i18n) { return res.send(404); }
    i18n.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
