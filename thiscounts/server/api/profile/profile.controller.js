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
exports.test_me = function (req, res) {
  var gaussian = require('gaussian');
  var distribution = gaussian(0,1);
// Take a random sample using inverse transform sampling method.
  //var sample = distribution.ppf(Math.random());
  let a = {
    pdf : {
      val: distribution.cdf(0),
      msg: "the probability density function, which describes the probability of a random variable taking on the value x"
    },
    cdf : {
      val: distribution.cdf(.75),
      msg: "++ the cumulative distribution function, which describes the probability of a random variable falling in the interval (−∞, x]"
    },
    ppf : {
      val: distribution.ppf(.5),
      msg:"the percent point function, the inverse of cdf"
    }
  };
  return res.status(201).json(a)
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
