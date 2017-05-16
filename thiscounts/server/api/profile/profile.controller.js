'use strict';

let _ = require('lodash');
let async = require('async');

let util = require('util');
let utils = require('../../components/utils').createUtils();

let Profile = require('./profile.model');
let User = require('../user/user.model');
let Card = require('../card/card.model');
let Business = require('../business/business.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('promotion');


// Get a single profile
exports.me = function (req, res) {

  function add_user(callback) {
    User.findOne({
      _id: req.user._id
    }, '-salt -hashedPassword -sms_code', callback);
  }

  function add_business(callback) {
    Business.find({creator: req.user._id}).limit(10).sort({created: -1}).select({name: 1, _id: 1}).exec(callback);
  }

  function add_saved(callback) {
    //console.log('1');                   start, name, ret_type, limit, callback
    graphModel.related_type_id(req.user._id, 'SAVED', "promotion", req.user._id, 0, 10, callback);

  }

  async.parallel({
      user: function (callback) {
        add_user(callback)
      },
      businesses: function (callback) {
        add_business(callback)
      },
      saved: function (callback) {
        add_saved(callback)
      }
    },
    function (err, profile) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(profile);
    });
};

// Get list of profiles
exports.index = function (req, res) {
  Profile.find(function (err, profiles) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(profiles);
  });
};

// Get a single profile
exports.show = function (req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    if (!profile) {
      return res.status(404).send('Not Found');
    }
    return res.json(profile);
  });
};

// Creates a new profile in the DB.
exports.create = function (req, res) {
  Profile.create(req.body, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(profile);
  });
};

// Updates an existing profile in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Profile.findById(req.params.id, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    if (!profile) {
      return res.status(404).send('Not Found');
    }
    let updated = _.merge(profile, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(profile);
    });
  });
};

// Deletes a profile from the DB.
exports.destroy = function (req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    if (!profile) {
      return res.status(404).send('Not Found');
    }
    profile.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

exports.realized_promotions = function (req, res) {
  let paginate = utils.to_paginate(req);
  graphModel.related_type_id_dir(req.user._id, 'REALIZED', 'promotion', 'out', paginate.skip, paginate.limit, function (err, followers) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(followers);
  });
};

exports.shared_promotions = function (req, res) {
  return res.status(204).send('No Content');
};

exports.saved_promotions = function (req, res) {
  let paginate = utils.to_paginate(req);
  //TODO: return only not realized and valid
  graphModel.related_type_id_dir(req.user._id, 'SAVED', 'promotion', 'out', paginate.skip, paginate.limit, function (err, followers) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(followers);
  });
};

exports.liked_malls = function (req, res) {
  let paginate = utils.to_paginate(req);
  graphModel.related_type_id_dir(req.user._id, 'LIKE', 'mall', 'out', paginate.skip, paginate.limit, function (err, followers) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(followers);
  });
};

exports.promotions_malls = function (req, res) {
  let paginate = utils.to_paginate(req);
  let query = util.format("MATCH (user { _id:'{%s}'})-[]->(:instance)-[]->(p:promotion)-[r:MALL_PROMOTION]->(m:mall)' return p._id ad _id skip %s limit %s", req.user._id, paginate.skip, paginate.limit);
  graphModel.query(query, function (err, malls) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(malls);
  });
};

const gaussian = require('gaussian');
const ss = require('simple-statistics');

function cascadeRounding(array) {
  /*
   Given an array of floats that sum to an integer, this rounds the floats
   and returns an array of integers with the same sum.
   */

  let fpTotal = 0;
  let intTotal = 0;
  let roundedArray = [];
  array.forEach(function (float, index) {
    let integer = Math.round(float + fpTotal) - intTotal;
    fpTotal += float;
    intTotal += integer;
    roundedArray.push(integer)
  });

  /*
   Some proofs
   */
  let sum = 0;
  array.forEach(function (num) {
    sum += num
  });
  out("Input: " + array);
  out("Input's sum: " + sum);

  sum = 0;
  roundedArray.forEach(function (num) {
    sum += num
  });
  out("Output: " + roundedArray);
  out("Output's sum: " + sum);

  return roundedArray
}

// function out() {
//   let args = Array.prototype.slice.call(arguments, 0);
//   document.getElementById('output').innerHTML += args.join(" ") + "\n";
// }
//
// cascadeRounding([3.614594838253174, 3.0347235317252936, 2.9433342851549944, 2.312143628092747, 1.980004561560413, 1.0910965165123099, 0.6642062974676156, 0.3598963412334531])

function spread_discounts(min, max, delta, quantity) {
  let values = [min,max];
  let mean = ss.mean(values);
  let variance = ss.variance(values);
  const distribution = gaussian(mean,variance);

  let spreads = [];
  let some_area=0;
  for (let value = min; value <= max; value += delta){
    let spread = {};
    let from = value - delta/2;
    let to = value + delta/2;
    spread.area =  distribution.cdf(to) - distribution.cdf(from);
    spread.value = value;
    some_area += spread.area;
    spreads.push(spread)
  }
  let sumq=0;

  //http://stackoverflow.com/questions/792460/how-to-round-floats-to-integers-while-preserving-their-sum
  //https://jsfiddle.net/cd8xqy6e/
  let fpTotal = 0;
  let intTotal = 0;
  spreads.forEach( (spread)=>{
    let float = (spread.area / some_area)*quantity;
    spread.quantity = Math.round(float + fpTotal) - intTotal;
    fpTotal += float;
    intTotal += spread.quantity;
    spread.area = undefined;
    sumq += spread.quantity;
  });
  console.log(sumq);
  return spreads;
}

exports.test_me = function (req, res) {
  let spreads = spread_discounts(20, 40, 5, 30);
  return res.status(201).json(spreads);

  // let area = 0;
  // let units = [];
  // for(let i=min; i<= max; i+=5 ) {
  //   let cdf = distribution.cdf(i);
  //   units.push({
  //     val: i,
  //     cdf: distribution.cdf(i)
  //   });
  // }
  // //  Take a random sample using inverse transform sampling method.
  // //  var sample = distribution.ppf(Math.random());
  // let a = {
  //   units: units,
  //   pdf : {
  //     val: distribution.pdf(mean),
  //     msg: "the probability density function, which describes the probability of a random variable taking on the value x"
  //   },
  //   cdf : {
  //     val: distribution.cdf(.75),
  //     msg: "the cumulative distribution function, which describes the probability of a random variable falling in the interval (−∞, x]"
  //   },
  //   ppf : {
  //     val: distribution.ppf(.5),
  //     msg:"the percent point function, the inverse of cdf"
  //   }
  // };
  // return res.status(201).json(a)
};

exports.realized_malls = function (req, res) {
  return res.status(204).send('No Content');
};

exports.member_cards = function (req, res) {
  let paginate = utils.to_paginate(req);
  let query = graphModel.paginate_query(
    `MATCH (s { _id:'${req.user._id}' })-[r:CARD_MEMBER]->(ret:card) return ret._id as _id`,
    paginate.skip, paginate.limit);
  graphModel.query_objects_general(Card, query,
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    })
};

exports.promotions_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.realized_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.followers = function (req, res) {
  let paginate = utils.to_paginate(req);

  graphModel.query_objects_general(User,
    graphModel.followers_query(req.user._id, paginate.skip, paginate.limit),
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    });
};

exports.following = function (req, res) {
  let paginate = utils.to_paginate(req);

  graphModel.query_objects_general(User,
    graphModel.following_query(req.user._id, paginate.skip, paginate.limit),
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
