'use strict';

const _ = require('lodash');
const Instance = require('./instance.model.js');
const Realize = require('../realize/realize.model');
const SavedInstance = require('../savedInstance/savedInstance.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('instance');
const randomstring = require('randomstring');
const QRCode = require('qrcode');
let MongodbSearch = require('../../components/mongo-search');


exports.search = MongodbSearch.create(Instance);

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
let SavedInstanceController = require('../savedInstance/savedInstance.controller');

function initializeIncreasing(instance) {
  return {
    from: instance.increasing.from,
    to: instance.increasing.to,
    days_eligible: instance.increasing.days_eligible,
  };
}

function initializeDoubling(instance) {
  return {
    value: instance.doubling.value,
  };
}

function initializeGrow(instance) {
  return {
    value: instance.grow.value,
  };
}

function initializePrepayDiscount(instance) {
  return {
    value: instance.prepay_discount.value,
    eligible_from: instance.prepay_discount.eligible_from,
    eligible_to: instance.prepay_discount.eligible_to,
    prepay: instance.prepay_discount.prepay
  };
}

function initializePunchCard(instance) {
  return {
    redeemTimes: [],
    product: instance.punch_card.product,
    number_of_punches: instance.punch_card.number_of_punches,
    days: instance.punch_card.days,
  };
}

function initializeCashBack(instance) {
  return {
    pay: instance.cash_back.pay,
    back: instance.cash_back.days,
  };
}

function initializeEarlyBooking(instance) {
  return {
    percent: instance.early_booking.percent,
    booking_before: instance.early_booking.days,
  };
}

function createSavedInstance(instance, user_id, callback) {
  let savedInstance = {
    user: user_id,
    instance: instance._id,
    type: instance.type
  };
  if (instance.type === 'INCREASING') {
    savedInstance.savedData.increasing = initializeIncreasing(instance)
  } else if (instance.type === 'DOUBLING') {
    savedInstance.savedData.doubling = initializeDoubling(instance)
  } else if (instance.type === 'GROW') {
    savedInstance.savedData.grow = initializeGrow(instance)
  } else if (instance.type === 'PREPAY_DISCOUNT') {
    savedInstance.savedData.prepay_discount = initializePrepayDiscount(instance)
  } else if (instance.type === 'PUNCH_CARD') {
    savedInstance.savedData.punch_card = initializePunchCard(instance)
  } else if (instance.type === 'CASH_BACK') {
    savedInstance.savedData.cash_back = initializeCashBack(instance)
  } else if (instance.type === 'EARLY_BOOKING') {
    savedInstance.savedData.early_booking = initializeEarlyBooking(instance)
  }
  SavedInstanceController.createSavedInstance(savedInstance, callback)
}

function relateSavedInstance(userId, savedInstance, instance, callback) {
  let realize_code = randomstring.generate({length: 10, charset: 'alphanumeric'});
  let save_time = new Date();
  instance.realize_code = realize_code;
  instance.save_time = save_time;

  graphModel.relate_ids(userId, 'SAVED', savedInstance._id, `{code: '${realize_code}',timestamp: '${save_time}'}`, function (err) {
    if (err) {
      return callback(err)
    }
    graphModel.relate_ids(savedInstance._id, 'SAVE_OF', instance._id, `timestamp: '${save_time}'}`, function (err) {
      if (err) {
        return callback(err)
      }
      return callback(null, instance);
    });
  });
}

function saveInstance(req, res, instance) {
  graphModel.query(`MATCH (i:instance { _id:'${req.params.id}'}) return i.quantity as quantity`, function (err, results) {
    if (err) {
      return handleError(res, err);
    }
    if (results.length !== 1 && results[0].quantity < 1) {
      return res.status(400).send('Run out of instances');
    }
    createSavedInstance(instance, req.user._id, function (err, savedInstance) {
      if (err) return handleError(res, err);
      relateSavedInstance(req.user._id, savedInstance, instance, function (err, instance) {
        if (err) return handleError(res, err);
        graphModel.query(`MATCH (i:instance { _id:'${req.params.id}'}) SET i.quantity=i.quantity-1`, function (err) {
          if (err) return handleError(res, err);
          return res.status(200).json(instance);
        });
      });
    });
  });
}

function isUniqueInstance(status) {
  status.forEach(s => {
    if (s.type === 'PUNCH_CARD' && s.status === 'REALIZED')
      return true;
  });
  return false;
}

//'/save/:id'
exports.save = function (req, res) {
  Instance
    .findById(req.params.id)
    .exec(function (err, instance) {
      if (err) {
        return handleError(res, err)
      }
      if (!instance) {
        return res.send(404)
      }
      const query = `MATCH (i:instance { _id:'${req.params.id}'})<-[sf:SAVE_OF]-(si:SavedInstance)<-[r:REALIZED|:SAVED]-(:user{ _id: '${req.user._id}'}) 
                      return type(r) as status, i.type as type`;
      graphModel.query(query, function (err, status) {
        if (err) {
          return handleError(res, err);
        }
        if (isUniqueInstance(status)) {
          return res.status(500).send(`Can not save instance type of ${status[0].type}, in case it was used or redeemed`);
        }
        return saveInstance(req, res, instance);
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
      const query = `MATCH (i:instance { _id:'${req.params.id}'})<-[sf:SAVE_OF]-(si:SavedInstance{instance_id:${req.params.id})<-[r:SAVED]-(:user{ _id: '${req.user._id}'}) SET i.quantity=i.quantity+1 delete r`;
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
          return callback(new Error('instance not found'));
        if (instance.remaining <= 0)
          return callback(new Error('instance remaining <= 0'));
        instance.remaining -= 1;
        instance.realizations.push(realize);
        instance.save(function (err) {
          if (err) {
            return callback(err)
          }
          return callback(null, instance);
        });
      })
  });
}

function firstSecondRedeemTimeLogic(obj) {
  if(obj.firstRedeemTime && obj.secondRedeemTime)
    throw new Error('first and second redeem time already set');
  if (!obj.firstRedeemTime)
    obj.firstRedeemTime = Date.now();
  else
    obj.secondRedeemTime = Date.now();
  return obj;
}
function redeemTimeLogic(obj) {
  if(obj.redeemTime)
    throw new Error('redeem time already set');
  obj.redeemTime = Date.now();
  return obj;
}

function punchCardRedeemLogic(punch_card) {
  if(punch_card.won) throw new Error('punch card already market as won');
  if(punch_card.redeemTimes.length >= punch_card.number_of_punches ) throw new Error('punch card already won by number of punches');
  punch_card.redeemTimes.push(Date.now());
  punch_card.redeemTimes.won = true;
  return punch_card;
}

function updateSavedInstanceRealized(saved, callback) {
  try {
    let type = saved.instance.type;
    if (type === 'INCREASING') {
      saved.savedData.increasing = firstSecondRedeemTimeLogic(saved.savedData.increasing);
    } else if (type === 'DOUBLING') {
      saved.savedData.doubling = firstSecondRedeemTimeLogic(saved.savedData.doubling)
    } else if (type === 'GROW') {
      saved.savedData.grow = firstSecondRedeemTimeLogic(saved.savedData.grow);
    } else if (type === 'PREPAY_DISCOUNT') {
      saved.savedData.prepay_discount = firstSecondRedeemTimeLogic(saved.savedData.prepay_discount);
    } else if (type === 'PUNCH_CARD') {
      saved.savedData.punch_card = punchCardRedeemLogic(saved.savedData.punch_card);
    } else if (type === 'CASH_BACK') {
      saved.savedData.cash_back = redeemTimeLogic(saved.savedData.cash_back);
    } else if (type === 'EARLY_BOOKING') {
      saved.savedData.early_booking = redeemTimeLogic(saved.savedData.early_booking);
    } else
      saved.savedData.other = redeemTimeLogic(saved.savedData.other);
  }catch(err){
    return callback(err)
  }
  return saved.save(callback)
}

function realizeSavedInstance(user, savedInstance, rel, res) {
  SavedInstance.findById(savedInstance._id).exec(function (err, saved) {
    if (err) return handleError(res, err);
    if (!saved) return handleError(res, new Error('no saved Instance found'));
    updateSavedInstanceRealized(saved, function (err, savedInstance) {
      if (err) return handleError(res, err);
      graphModel.relate_ids(user._id, 'REALIZED', savedInstance._id, `{code: '${rel.properties.code}', timestamp: '${ new Date()}'}`,
        function (err) {
          if (err) return handleError(res, err);
          graphModel.unrelate_ids(user._id, 'SAVED', savedInstance._id, function (err) {
            if (err) return handleError(res, err);
            updateInstanceById(user._id, savedInstance.instance._id, function (err, instance) {
              if (err) return handleError(res, err);
              savedInstance.instance = instance;
              return res.status(200).json({savedInstance});
            });
          })
        })
    });
  });
}

//TODO: validate sale_point_code
exports.realize = function (req, res) {
  const query = `MATCH (promotion:promotion)<-[:INSTANCE_OF]-(instance:instance)<-[sf:SAVE_OF]-(saved:SavedInstance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user})
                 where saved._id = '${req.params.id}' and saved.type = 'PUNCH_CARD' and user._id='${req.user._id}'
                 return promotion,instance,rel,user, savedInstance`;

  // const query = `MATCH (promotion:promotion)<-[:INSTANCE_OF]-(instance:instance)<-[sf:SAVE_OF]-(savedInstance:SavedInstance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user)
  //               return promotion,instance, savedInstance, rel,user`;
  graphModel.query(query, function (err, objects) {
    if (err) return handleError(res, err);
    if (objects.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (objects.length > 1)
      return res.status(500).send('multiple instances found');

    let promotion = objects[0].promotion;
    let instance = objects[0].instance;
    let savedInstance = objects[0].savedInstance;
    let rel = objects[0].rel;
    let user = objects[0].user;

    if (promotion.validate_barcode) {
      graphModel.query(`MATCH (pn:promotion)-[:PRODUCT]->(pt:product)-[:BARCODE]->(barcode:barcode) where id(pn)=${promotion.id} return barcode`,
        function (err, barcodes) {
          if (err) return handleError(res, err);
          if (barcodes.length !== 1)
            return res.status(403).send('non or multiple barcode found');
          if (barcodes[0].code !== req.params.barcode)
            return res.status(403).send('required barcode mismatch');
          return realizeSavedInstance(user, savedInstance, rel, res, instance);
        });
    } else {
      return realizeSavedInstance(user, savedInstance, rel, res, instance);
    }
  });
};

exports.realized = function (req, res) {
  const query = `MATCH (instance:instance)<-[sf:SAVE_OF]-(savedInstance:SavedInstance)<-[rel:REALIZED{code: '${req.params.code}'}]-(user:user) 
                return instance,savedInstance,rel,user`;
  graphModel.query(query, function (err, objects) {
    if (err) return handleError(res, err);
    if (objects.length === 0)
      return res.status(404).send(`realize code mismatch`);

    if (objects.length === 1)
      return res.status(200).send(objects[0]);
  });
};

exports.punch = function (req, res) {
  SavedInstance
    .findById(req.params.id)
    .exec(function (err, savedInstance) {
      if (err) {
        return handleError(res, err);
      }
      if (!savedInstance) {
        return res.send(404);
      }

      const query = `MATCH (:instance)<-[sf:SAVE_OF]-(saved:SavedInstance)<-[r:SAVED]-(:user{ _id: '${req.user._id}'})
                      where saved._id = '${req.params.id}' and saved.type = 'PUNCH_CARD'
                      return savedInstance, r.code as code`;
      graphModel.query(query, function (err, savedInstances) {
        if (err) {
          return handleError(res, err);
        }
        if (savedInstances.length !== 1) {
          return res.status(500).send(`Expecting exactly one not yet redeemed punch card found ${savedInstances.length}`);
        }
        if (savedInstance.redeemTimes.length >= savedInstance.number_of_punches)
          return res.status(500).send(`redeemTimes.length >= number_of_punches`);
        if (savedInstance.redeemTimes.length === savedInstance.number_of_punches - 1)
          return res.status(200).json({
            last_punch: true,
            code: savedInstances[0].code,
            savedInstance: savedInstance
          });
        savedInstance.redeemTimes.push(Date.now());
        savedInstance.save(function (err, savedInstance) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(savedInstance)
        })
      });
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
      t: 'i',
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
