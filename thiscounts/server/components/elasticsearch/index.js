'use strict';
let elasticsearch = require('elasticsearch');

exports.create = function create(class_name) {
  return new Elasticsearch();
};
