'use strict';

const _ = require('lodash');
const Instance = require('./instance.model.js');
const Realize = require('../realize/realize.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('instance');
const randomstring = require('randomstring');
import QRCode from 'qrcode';

// Get list of instances
exports.index = function (req, res) {
  Instance.find(function (err, instances) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, instances);
  });
};

// Get a single instance
exports.show = function (req, res) {
  Instance.findById(req.params.id, function (err, instance) {
    if (err) {
      return handleError(res, err);
    }
    if (!instance) {
      return res.send(404);
    }
    return res.json(instance);
  });
};

// Creates a new instance in the DB.
exports.create = function (req, res) {
  Instance.create(req.body, function (err, instance) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(instance, function (err) {
      if (err) {
        return handleError(res, err);
      }
    });
    return res.json(201, instance);
  });
};

// Updates an existing instance in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Instance.findById(req.params.id, function (err, instance) {
    if (err) {
      return handleError(res, err);
    }
    if (!instance) {
      return res.send(404);
    }
    let updated = _.merge(instance, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, instance);
    });
  });
};

// Deletes a instance from the DB.
exports.destroy = function (req, res) {
  Instance.findById(req.params.id, function (err, instance) {
    if (err) {
      return handleError(res, err);
    }
    if (!instance) {
      return res.send(404);
    }
    instance.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

//'/save/:id'
exports.save = function (req, res) {
  Instance
    .findById(req.params.id)
    .exec(function (err, instance) {
      if (err) {
        return handleError(res, err);
      }
      if (!instance) {
        return res.send(404);
      }
      const query = `MATCH (:instance { _id:'${req.params.id}'})<-[r:REALIZED|:SAVED]-(:user{ _id: '${req.user._id}'}) return r`;
      graphModel.query(query, function (err, realize) {
        if (err) { return handleError(res, err); }
        if (realize.length > 0) { return res.status(500).send('Instance already realized or saved'); }

        let realize_code = randomstring.generate({length: 8, charset: 'numeric'});
        let save_time = new Date();
        graphModel.relate_ids(req.user._id, 'SAVED', instance._id, `{code: '${realize_code}',timestamp: '${save_time}'}`, function (err) {
          if (err) return handleError(res, err);
          instance.realize_code = realize_code;
          instance.save_time = save_time;
          return res.json(200, instance);
        });
      });
    })
};


function updateInstanceById(user_id, instance_id) {
  Realize.create({
    user: user_id,
    instance: instance_id
  }, function (err, realize) {
    Instance
      .findById(instance_id)
      .exec(function (err, instance) {
        if (err) console.error(err);
        if (!instance)
          return console.error('instance not found');
        if (instance.remaining <= 0)
        return console.error('instance remaining <= 0');
        instance.remaining -= 1;
        instance.realizations.push(realize);
        instance.save();
      })
  });
}

//'/realize/:realize_code'
//TODO: add validation of authenticated user and sale_point_code
exports.realize = function (req, res) {
  const query = `MATCH (instance:instance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user) return instance,rel,user`;
  graphModel.query(query, function (err, objects) {
    if (err) return handleError(res, err);
    if (objects.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (objects.length > 1)
      return res.status(500).send('multiple instances found');

    let instance = objects[0].instance;
    let rel = objects[0].rel;
    let user = objects[0].user;

    graphModel.relate_ids(user._id, 'REALIZED', instance._id, `{code: '${rel.properties.code}', timestamp: '${ new Date()}'}`, function (err) {
      if (err) return handleError(res, err);
      graphModel.unrelate_ids(user._id, 'SAVED', instance._id, function (err) {
        if (err) return handleError(res, err);
        updateInstanceById(user._id, instance._id);
        return res.json(200, instance);
      })
    })
  });
};

exports.qrcode = function (req, res) {
  const query = `MATCH (instance:instance{_id:${req.params.id})<-[rel:SAVED]-(user:user{_id:${req.user._id}) return rel.code`;
  graphModel.query(query, function (err, codes) {
    if (err) return handleError(res, err);
    if (codes.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (codes.length > 1)
      return res.status(500).send('multiple instances found');

    QRCode.toDataURL(JSON.stringify({
      code: code[0]
    }), function (err, url) {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).json({
          qrcode: url
        });
      }
    });
  })
};

function handleError(res, err) {
  return res.send(500, err);
}
