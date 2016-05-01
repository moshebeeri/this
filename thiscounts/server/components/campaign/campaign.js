'use strict';

var _ = require('lodash');
var db = require('seraph')({  server: "http://localhost:7474",
  user: "neo4j",
  pass: "saywhat" });

var model = require('seraph-model');
var PromotionGraph = model(db, 'promotion');

var logger = require('../logger').createLogger();

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

function Campaign(params) {
  logger.info("Campaign constructed");
  this.prototype.params = params;
}

Campaign.prototype.create = function create(object, callback) {
  logger.info("Campaign: " + user_id + " realized " + object._id, object.constructor.name);
  callback(null, null);
};

module.exports = Campaign;
