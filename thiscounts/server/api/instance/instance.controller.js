'use strict';

const _ = require('lodash');
const Instance = require('./instance.model.js');
const Realize = require('../realize/realize.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('instance');
const randomstring = require('randomstring');
const QRCode = require('qrcode');

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

//'/available/:id'
exports.available = function (req, res) {
  Instance
    .findById(req.params.id)
    .exec(function (err, instance) {
      if (err) {
        return handleError(res, err);
      }
      if (!instance) {
        return res.send(404);
      }
      const query = `MATCH (i:instance { _id:'${req.params.id}'}) return i.quantity`;
      graphModel.query(query, function (err, results) {
        if (err) {
          return handleError(res, err);
        }
        if (results.length !== 1) {
          return res.status(500).send(`results length error ${results.length} should be 1`);
        }
        return res.json(200, results[0]);
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
        if (err) {
          return handleError(res, err);
        }
        if (realize.length > 0) {
          return res.status(500).send('Instance already realized or saved');
        }
        graphModel.query(`MATCH (i:instance { _id:'${req.params.id}'}) return i.quantity as quantity`, function (err, results) {
          if (err) {
            return handleError(res, err);
          }
          if (results.length !== 1 && results[0].quantity < 1) {
            return res.status(400).send('Run out of instances');
          }
          let realize_code = randomstring.generate({length: 10, charset: 'alphanumeric'});
          let save_time = new Date();
          graphModel.relate_ids(req.user._id, 'SAVED', instance._id, `{code: '${realize_code}',timestamp: '${save_time}'}`, function (err) {
            if (err) return handleError(res, err);
            instance.realize_code = realize_code;
            instance.save_time = save_time;
            graphModel.query(`MATCH (i:instance { _id:'${req.params.id}'}) SET i.quantity=i.quantity-1`, function (err) {
              if (err) return handleError(res, err);
              return res.status(200).json(instance);
            });
          });
        });
      });
    });
};

//'/unsave/:id'
exports.unsave = function (req, res) {
  Instance
    .findById(req.params.id)
    .exec(function (err, instance) {
      if (err) {
        return handleError(res, err);
      }
      if (!instance) {
        return res.send(404);
      }
      const query = `MATCH (i:instance { _id:'${req.params.id}'})<-[r:SAVED]-(:user{ _id: '${req.user._id}'}) SET i.quantity=i.quantity+1 delete r`;
      graphModel.query(query, function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, instance);
      });
    })
};


function updateInstanceById(user_id, instance_id, callback) {
  Realize.create({
    user: user_id,
    instance: instance_id
  }, function (err, realize) {
    Instance
      .findById(instance_id)
      .populate('promotion')
      .exec(function (err, instance) {
        if (err) return callback(err);
        if (!instance)
          return callback( new Error('instance not found'));
        if (instance.remaining <= 0)
          return callback( new Error('instance remaining <= 0'));
        instance.remaining -= 1;
        instance.realizations.push(realize);
        instance.save(function (err) {
          if(err) {return callback(err)}
          return callback(null, instance);
        });
      })
  });
}

//'/realize/:realize_code'
//TODO: add validation of authenticated user and sale_point_code
exports.realize = function (req, res) {
  const query = `MATCH (promotion:promotion)<-[:INSTANCE_OF]-(instance:instance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user) 
                return promotion,instance,rel,user`;
  graphModel.query(query, function (err, objects) {
    if (err) return handleError(res, err);
    if (objects.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (objects.length > 1)
      return res.status(500).send('multiple instances found');

    let promotion = objects[0].promotion;
    let instance = objects[0].instance;
    let rel = objects[0].rel;
    let user = objects[0].user;

    function realize_instance() {
      graphModel.relate_ids(user._id, 'REALIZED', instance._id, `{code: '${rel.properties.code}', timestamp: '${ new Date()}'}`,
        function (err) {
          if (err) return handleError(res, err);
          graphModel.unrelate_ids(user._id, 'SAVED', instance._id, function (err) {
            if (err) return handleError(res, err);
            updateInstanceById(user._id, instance._id, function (err, mongodb_instance) {
              if (err) return handleError(res, err);
              return res.status(200).json({g_instance: instance, instance: mongodb_instance});
            });
          })
        })
    }
    if(promotion.validate_barcode) {
      graphModel.query(`MATCH (pn:promotion)-[:PRODUCT]->(pt:product)-[:BARCODE]->(barcode:barcode) where id(pn)=${promotion.id} return barcode`,
        function (err, barcodes) {
          if (err) return handleError(res, err);
          if (barcodes.length !== 1)
            return res.status(403).send('non or multiple barcode found');
           if(barcodes[0].code !== req.params.barcode)
            return res.status(403).send('required barcode mismatch');
          return realize_instance();
        });
    }else{
      return realize_instance();
    }
  });
};

exports.realized = function (req, res) {
  const query = `MATCH (instance:instance)<-[rel:REALIZED{code: '${req.params.code}'}]-(user:user) return instance,rel,user`;
  graphModel.query(query, function (err, objects) {
    if (err) return handleError(res, err);
    if (objects.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (objects.length === 1)
      return res.status(200).send(objects[0]);
  });
};

exports.qrcode = function (req, res) {
  const query = `MATCH (instance:instance{_id:"${req.params.id}"})<-[rel:SAVED]-(user:user{_id:"${req.user._id}"}) return rel.code`;
  graphModel.query(query, function (err, codes) {
    if (err) return handleError(res, err);
    if (codes.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (codes.length > 1)
      return res.status(500).send('multiple instances found');

    QRCode.toDataURL(JSON.stringify({
      code: codes[0]['rel.code']
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
