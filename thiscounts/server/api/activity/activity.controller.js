'use strict';

const _ = require('lodash');
const Activity = require('./activity.model');
let activityUtils = require('../../components/activity').createActivity();
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('activity');

// Get list of activities
exports.index = function (req, res) {
  Activity.find(function (err, activitys) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, activitys);
  });
};

// Get a single activity
exports.show = function (req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if (err) {
      return handleError(res, err);
    }
    if (!activity) {
      return res.send(404);
    }
    return res.json(activity);
  });
};

// Creates a new activity in the DB.
exports.create = function (req, res) {
  Activity.create(req.body, function (err, activity) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, activity);
  });
};

// Updates an existing activity in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Activity.findById(req.params.id, function (err, activity) {
    if (err) {
      return handleError(res, err);
    }
    if (!activity) {
      return res.send(404);
    }
    let updated = _.merge(activity, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, activity);
    });
  });
};

// Deletes a activity from the DB.
exports.destroy = function (req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if (err) {
      return handleError(res, err);
    }
    if (!activity) {
      return res.send(404);
    }
    activity.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};
function getActivityEntityId(sharedActivity){
  if( sharedActivity.instance     ) return  sharedActivity.instance._id ;
  if( sharedActivity.promotion    ) return  sharedActivity.promotion._id;
  if( sharedActivity.product      ) return  sharedActivity.product ._id ;
  if( sharedActivity.group        ) return  sharedActivity.group   ._id ;
  if( sharedActivity.user         ) return  sharedActivity.user    ._id ;
  if( sharedActivity.business     ) return  sharedActivity.business._id ;
  if( sharedActivity.mall         ) return  sharedActivity.mall    ._id ;
  if( sharedActivity.chain        ) return  sharedActivity.chain   ._id ;
  if( sharedActivity.activity     ) return  sharedActivity.activity._id ;
}

exports.share = function (req, res) {
  Activity.findById(req.params.id, function (err, sharedActivity) {
    if (err) { return handleError(res, err);}
    if (!sharedActivity) {return res.send(404);}
    if(sharedActivity.sharable === false) { return handleError(res, new Error('activity is not sharable'));}
    let act = {
      activity: req.params.activity,
      ids: [req.params.user],
      action: 'share',
      sharable: false
    };
    act.actor_user = req.user._id;
    activityUtils.create(act, function (err, shareActivity) {
      graphModel.relate_ids(req.user._id, 'SHARE', getActivityEntityId(sharedActivity));
      return res.json(200, shareActivity);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
