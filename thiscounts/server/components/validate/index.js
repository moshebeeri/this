'use strict';

const _ = require('lodash');
let utils = require('../utils').createUtils();

function Validator() {
}

Validator.entity_validator = function (v) {
        if (_.isNull(v))
          return false;
        let i = 0;
        if(utils.defined(v.user))
          i++;
        if(utils.defined(v.group))
          i++;
        if(utils.defined(v.business))
          i++;
        if(utils.defined(v.shopping_chain))
          i++;
        if(utils.defined(v.mall))
          i++;
        return i === 1
  };


module.exports = Validator;

