'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
//const logger = require('../logger').createLogger();
const async = require('async');

function MongodbSearch() {
}

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

MongodbSearch.searchSchema =
  MongodbSearch.prototype.searchSchema = function (schema, req, res) {

  };

MongodbSearch.create =
  MongodbSearch.prototype.create = function (schema) {
    return function(req, res) {
      let searchString = req.params.searchString;
      schema.find({$text: {$search: searchString}}, '-salt -hashedPassword -sms_code')
        .skip(parseInt(req.params.skip))
        .limit(parseInt(req.params.limit))
        .exec(function (err, objects) {
          if(err) return handleError(res, err);
          return res.status(200).json(objects);
        })
    }
  };

MongodbSearch.search =
  MongodbSearch.prototype.search = function (schema, req, res) {

  };

module.exports = MongodbSearch;

