'use strict';

var _ = require('lodash');
var db = require('seraph')({  server: "http://localhost:7474",
  user: "neo4j",
  pass: "saywhat" });

var model = require('seraph-model');
//var PromotionGraph = model(db, 'promotion');

//var winston = require('winston');
//var logger = new (winston.Logger)({
//  transports: [
//    new (winston.transports.Console)()//,
//    //new (winston.transports.File)({ filename: 'somefile.logger' })
//  ]
//});

var logger = require('../logger').createLogger();

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActivitySchema = new Schema({
  user: {type: ObjectId, ref: 'User'},
  promotion: {type: ObjectId, ref: 'Promotion'},
  actor: { type: String, ref: 'User' },
  action: { type: String, default: ""} //ex: has replied to:, or started following:
});

//See - http://stackoverflow.com/questions/19647012/mongoose-activity-model-with-dynamic-reference
function Activity(params) {
  logger.info("Activity constructed");
  this.prototype.params = params;
}

Activity.prototype.like = function like(user_id, object, callback) {
  logger.info("activity: " + user_id + " like " + object._id, object.constructor.name);
  var activitySchema = new ActivitySchema({
    user : user_id,
    action: "like"
  });

  ActivitySchema.create(activitySchema, function(err, activitySchema) {
    if(err) {
      callback(err,null);
      return;
    }
    callback(null, activitySchema);
  });
};

Activity.prototype.realize = function realize(object, callback) {
  logger.info("activity: " + user_id + " realized " + object._id, object.constructor.name);
  callback(null, null);
};

Activity.prototype.use = function use(object, callback) {
  logger.info("activity: " + user_id + " used " + object._id, object.constructor.name);
  callback(null, null);
};

Activity.prototype.report = function report(object, callback) {
  logger.info("activity: " + user_id + " reporting " + object._id, object.constructor.name);
  callback(null, null);
};

Activity.prototype.share = function share(object, callback) {
  logger.info("activity: " + user_id + " shared " + object._id, object.constructor.name);
  callback(null, null);
};

Activity.prototype.roll = function roll(object, callback) {
  logger.info("activity: " + user_id + " realized " + object._id, object.constructor.name);
  callback(null, null);
};

module.exports = Activity;
