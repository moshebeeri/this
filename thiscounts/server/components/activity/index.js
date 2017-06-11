'use strict';

let Activity = require('./activity');

exports.createActivity = function createActivity(params) {
  return new Activity(params);
};
