'use strict';

var Activity = require('./activity');

exports.createActivity = function createActivity(params) {
  return new Activity(params);
};
