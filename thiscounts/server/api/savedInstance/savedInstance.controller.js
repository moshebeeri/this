'use strict';

let _ = require('lodash');
let SavedInstance = require('./savedInstance.model.js');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('SavedInstance');


// Get list of savedInstances
exports.index = function (req, res) {
  SavedInstance.find(function (err, savedInstances) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, savedInstances);
  });
};

// Get a single savedInstance
exports.show = function (req, res) {
  SavedInstance.findById(req.params.id, function (err, savedInstance) {
    if (err) {
      return handleError(res, err);
    }
    if (!savedInstance) {
      return res.send(404);
    }
    return res.json(savedInstance);
  });
};

function toGraph(savedInstance) {
  return {
    _id: savedInstance._id,
    created: savedInstance.created,
    user: savedInstance.user,
    instance_id: savedInstance.instance,
    type: savedInstance.type
  }
}

exports.createSavedInstance = function (savedInstance, callback) {
  savedInstance.created = Date.now();
  SavedInstance.create(savedInstance, function (err, savedInstance) {
    if (err) { return callback(err); }
    graphModel.reflect(savedInstance, toGraph(savedInstance), function (err, savedInstance) {
      if (err) {
        return callback(err);
      }
      return callback(null, savedInstance);
    });
  });
};

// Creates a new savedInstance in the DB.
exports.create = function (req, res) {
  this.createSavedInstance(req.body, function (err, savedInstance) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, savedInstance);
  });
};

// Updates an existing savedInstance in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  SavedInstance.findById(req.params.id, function (err, savedInstance) {
    if (err) {
      return handleError(res, err);
    }
    if (!savedInstance) {
      return res.send(404);
    }
    let updated = _.merge(savedInstance, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, savedInstance);
    });
  });
};

// Deletes a savedInstance from the DB.
exports.destroy = function (req, res) {
  SavedInstance.findById(req.params.id, function (err, savedInstance) {
    if (err) {
      return handleError(res, err);
    }
    if (!savedInstance) {
      return res.send(404);
    }
    savedInstance.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

exports.qrcode = function (req, res) {
  const query = `MATCH (:user{_id:'${req.user._id}'})-[:ROLE]-(:business)-[r]-(:promotion)<-[:INSTANCE_OF]-(:instance)<-[:SAVE_OF]-(savedInstance:SavedInstance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user) 
                return savedInstance._id as _id`;

  graphModel.query_objects(SavedInstance, query,
    '', 0, 1, function (err, savedInstances) {
      if(err) { return handleError(res, err); }
      if(savedInstances.length > 1) { return handleError(res, new Error('multi instances save on same code')); }
      if(savedInstances.length === 0) { return res.status(404).json('user has no role to authorize promotions for this business'); }
      return res.status(200).json(savedInstances[0]);
    })
};

function handleError(res, err) {
  return res.send(500, err);
}
