'use strict';

var _ = require('lodash');
var async = require('async');

var Feed = require('./feed.model');

// Get list of feeds
// See http://mongoosejs.com/docs/populate.html
exports.index = function (req, res) {
  //Feed.find(function (err, feeds) {
  //  if(err) { return handleError(res, err); }
  //  return res.status(200).json(feeds);
  //});
  //Feed.find().populate({
  //  path: 'activity',
  //  populate: { path: 'actor_user', model: 'User' }
  //}).exec(function (err, feeds) {
  //  if(err) { return handleError(res, err); }
  //  return res.status(200).json(feeds);
  //});

//http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
  Feed.find().populate({path: 'activity'})
    .exec(function (err, feeds) {
      if (err) {
        return handleError(res, err);
      }

      function populate_promotion(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.promotion', model: 'Promotion'}, callback);
      }
      function populate_user(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.user', select: '-salt -hashedPassword -gid -role -__v -email -phone_number', model: 'User'}, callback);
      }
      function populate_business(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.business', model: 'Business'}, callback);
      }
      function populate_mall(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.mall', model: 'Mall'}, callback);
      }
      function populate_chain(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.chain', model: 'ShoppingChain'}, callback);
      }
      function populate_actor_user(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.actor_user', select: '-salt -hashedPassword -gid -role -__v -email -phone_number', model: 'User'}, callback);
      }
      function populate_actor_business(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.actor_business', model: 'Business'}, callback);
      }
      function populate_actor_mall(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.actor_mall', model: 'Mall'}, callback);
      }
      function populate_actor_chain(feeds, callback) {
        Feed.populate(feeds, {path: 'activity.actor_chain', model: 'ShoppingChain'}, callback);
      }

      async.waterfall([
        async.apply(populate_promotion, feeds),
        populate_user,
        populate_business,
        populate_mall,
        populate_chain,
        populate_actor_user,
        populate_actor_business,
        populate_actor_mall,
        populate_actor_chain

      ], function (err, feeds) {
        if(err) {res.status(500).json(err);}
        return res.status(200).json(feeds);
      });

      //async.parallel([
      //  { path: 'activity.promotion'      , model: 'Promotion'    },
      //  { path: 'activity.user'           , model: 'User'         },
      //  { path: 'activity.business'       , model: 'Business'     },
      //  { path: 'activity.mall'           , model: 'Mall'         },
      //  { path: 'activity.chain'          , model: 'SoppingChain' },
      //  { path: 'activity.actor_user'     , model: 'User'         },
      //  { path: 'activity.actor_business' , model: 'Business'     },
      //  { path: 'activity.actor_mall'     , model: 'Mall'         },
      //  { path: 'activity.actor_chain'    , model: 'SoppingChain' }
      //];

      //var options = {path: 'activity.actor_user', model: 'User'};
      //Feed.populate(feeds, options, function (err, feeds) {
      //  return res.status(200).json(feeds);
      //});
    });
};

//var populate_all = async.compose(pupulate( { path: 'activity.actor_user', model: 'User' }, feeds), add1);



//populate: { path: 'promotion user business mall chain actor_user actor_business actor_mall actor_chain' }

// Get a single feed
exports.show = function (req, res) {
  Feed.findById(req.params.id, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    return res.json(feed);
  });
};

// feed
exports.feed = function (req, res) {
  var userId = req.params.id;
  var last_id = req.params.last_id;
  var query_builder = Feed.find({user: userId}).elemMatch('activity');

  if (req.params.scroll != 'up' && req.params.scroll != 'down') {
    return res.status(400).send('scroll value may be only up or down');
  }

  if (last_id == 'start') {
  } else {
    if (req.params.scroll === 'up')
      query_builder = query_builder.gt(last_id);
    else if (req.params.scroll === 'down')
      query_builder = query_builder.lt(last_id);
  }
  query_builder.sort({activity: -1}).limit(25).exec(function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    return res.json(feed);
  });
};

//exec(callback);
//
//Feed.
//find({
//  user: userId,
//  age: { $gt: 17, $lt: 66 },
//  likes: { $in: ['vaporizing', 'talking'] }
//}).
//limit(10).
//sort({ occupation: -1 }).
//select({ name: 1, occupation: 1 }).


// Creates a new feed in the DB.
exports.create = function (req, res) {
  Feed.create(req.body, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(feed);
  });
};

// Updates an existing feed in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Feed.findById(req.params.id, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(feed, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(feed);
    });
  });
};

// Deletes a feed from the DB.
exports.destroy = function (req, res) {
  Feed.findById(req.params.id, function (err, feed) {
    if (err) {
      return handleError(res, err);
    }
    if (!feed) {
      return res.status(404).send('Not Found');
    }
    feed.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
