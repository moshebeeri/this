'use strict';

var _ = require('lodash');
var async = require('async');

var Profile = require('./profile.model');
var User = require('../user/user.model');
var Business = require('../business/business.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('promotion');

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
  //graphModel.relate_ids(req.user._id, 'REALIZED', req.params.id, {timestamp: Date.now()});
  return res.status(204).send('No Content');
};

exports.shared_promotions = function (req, res) {
  return res.status(204).send('No Content');
};

exports.saved_promotions = function (req, res) {
  return res.status(204).send('No Content');
};

exports.liked_malls = function (req, res) {
  return res.status(204).send('No Content');
};

exports.promotions_malls = function (req, res) {
  return res.status(204).send('No Content');
};

exports.realized_malls = function (req, res) {
  return res.status(204).send('No Content');
};

exports.member_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.promotions_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.realized_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.followers = function (req, res) {
  graphModel.followers(req.user._id, 0, 10, function(err, followers) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(followers);
  });
};

exports.following = function (req, res) {
  graphModel.following(req.user._id, 0, 10, function(err, following) {
    if (err) { return handleError(res, err)}
    return res.status(200).json(following);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
