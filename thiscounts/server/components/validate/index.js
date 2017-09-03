'use strict';

const _ = require('lodash');


exports.entity_validator = function (v) {
        if (_.isNull(v))
          return false;
        let i = 0;
        if(v.user)
          i++;
        if(v.group)
          i++;
        if(v.business)
          i++;
        if(v.shopping_chain)
          i++;
        if(v.mall)
          i++;
        return i === 1
  };

