'use strict';
var elasticsearch = require('elasticsearch');

exports.create = function create(class_name) {
  return new Elasticsearch();
};
