'use strict';

let _ = require('lodash');
let config = require('../../config/environment');

let db = require('seraph')({
  server: config.neo4j.uri,
  user: "neo4j",
  pass: "saywhat"
});

let model = require('seraph-model');
let PromotionGraph = model(db, 'promotion');

let logger = require('../logger').createLogger();

let mongoose = require('mongoose'),
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
