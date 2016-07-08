'use strict';

var _ = require('lodash');
var async = require('async');

var utils = require('../../components/utils').createUtils();
var Profile = require('./profile.model');
var User = require('../user/user.model');
var Business = require('../business/business.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('promotion');


function to_paginate(req){
  var skip = req.params.skip;
  var limit = req.params.limit;

  if(!utils.defined(skip) || !_.isNumber(skip))
    skip = 0;
  if(!utils.defined(limit) || !_.isNumber(limit))
    limit = 10;

  return {
    skip: skip,
    limit: limit
  }
}


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
    var updated = _.merge(profile, req.body);
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
  var paginate = to_paginate(req);
  graphModel.related_type_id_dir(req.user._id, 'REALIZED', 'promotion', 'out', paginate.skip, paginate.limit, function(err, followers) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(followers);
  });
};

exports.shared_promotions = function (req, res) {
  return res.status(204).send('No Content');
};

exports.saved_promotions = function (req, res) {
  var paginate = to_paginate(req);
  //TODO: return only not realized and valid
  graphModel.related_type_id_dir(req.user._id, 'SAVED', 'promotion', 'out', paginate.skip, paginate.limit, function(err, followers) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(followers);
  });
};

exports.liked_malls = function (req, res) {
  var paginate = to_paginate(req);
  graphModel.related_type_id_dir(req.user._id, 'LIKE', 'mall', 'out', paginate.skip, paginate.limit, function(err, followers) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(followers);
  });
};
var util = require('util');

exports.promotions_malls = function (req, res) {
  var paginate = to_paginate(req);
  var query = util.format("MATCH (user { _id:'{%s}'})-[]->(:instance)-[]->(:promotion)-[r:MALL_PROMOTION]->(m:mall)' return m skip %s limit %s", req.user._id, paginate.skip, paginate.limit);
  graphModel.query(query,function(err, malls) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(malls);
  });
};

exports.realized_malls = function (req, res) {
  return res.status(204).send('No Content');
};

exports.member_cards = function (req, res) {
  var paginate = to_paginate(req);
  graphModel.related_type_id_dir(req.user._id, 'CARD_MEMBER', 'card', 'out', paginate.skip, paginate.limit, function(err, followers) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(followers);
  });
};

exports.promotions_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.realized_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.followers = function (req, res) {
  var paginate = to_paginate(req);
  graphModel.followers(req.user._id, paginate.skip, paginate.limit, function(err, followers) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(followers);
  });
};

exports.following = function (req, res) {
  var paginate = to_paginate(req);
  graphModel.following(req.user._id, paginate.skip, paginate.limit, function(err, following) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(following);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
