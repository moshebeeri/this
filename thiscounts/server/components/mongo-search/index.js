'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

exports.searchSchema = function (schema, req, res) {

};

exports.create = function (schema) {
  return function (req, res) {
    let searchString = req.params.searchString;
    schema.find({$text: {$search: searchString}}, '-salt -hashedPassword -sms_code')
      .skip(parseInt(req.params.skip))
      .limit(parseInt(req.params.limit))
      .exec(function (err, objects) {
        if (err) return handleError(res, err);
        return res.status(200).json(objects);
      })
  }
};

exports.search = function (schema, req, res) {

};

