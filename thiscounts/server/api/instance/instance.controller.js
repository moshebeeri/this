'use strict';
const _ = require('lodash');
const Instance = require('./instance.model.js');
const Realize = require('../realize/realize.model');
const SavedInstance = require('../savedInstance/savedInstance.model');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('instance');
const randomstring = require('randomstring');
const QRCode = require('qrcode');
const MongodbSearch = require('../../components/mongo-search');
const fireEvent = require('../../components/firebaseEvent');
const activity = require('../../components/activity').createActivity();
const pricing = require('../../components/pricing');
const Notifications = require('../../components/notification');
const SavedInstanceController = require('../savedInstance/savedInstance.controller');
const cardController = require('../card/card.controller');
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

function initializeIncreasing(instance) {
  return {
    from: instance.value.increasing.from,
    to: instance.value.increasing.to,
    days_eligible: instance.value.increasing.days_eligible,
  };
}

function initializeDoubling(instance) {
  return {
    value: instance.value.doubling.value,
  };
}

function initializeGrow(instance) {
  return {
    value: instance.value.grow.value,
  };
}

function initializePrepayDiscount(instance) {
  return {
    value: instance.value.prepay_discount.value,
    eligible_from: instance.value.prepay_discount.eligible_from,
    eligible_to: instance.value.prepay_discount.eligible_to,
    prepay: instance.value.prepay_discount.prepay
  };
}

function initializePunchCard(instance) {
  return {
    redeemTimes: [],
    product: instance.value.punch_card.product,
    number_of_punches: instance.value.punch_card.number_of_punches,
    days: instance.value.punch_card.days,
  };
}

function initializeHappyHour(instance) {
  return {
    redeemTimes: [],
    product: instance.value.happy_hour.product,
    days: instance.value.happy_hour.days,
    from: instance.value.happy_hour.from,
    until: instance.value.happy_hour.until
  };
}

function initializeCashBack(instance) {
  return {
    pay: instance.value.cash_back.pay,
    back: instance.value.cash_back.days,
  };
}

function initializeEarlyBooking(instance) {
  return {
    percent: instance.value.early_booking.percent,
    booking_before: instance.value.early_booking.days,
  };
}

function createSavedInstance(instance, user_id, context, callback) {
  let savedInstance = {
    user: user_id,
    instance: instance._id,
    type: instance.type,
    savedData: {}
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
  } else if (instance.type === 'HAPPY_HOUR') {
    savedInstance.savedData.happy_hour = initializeHappyHour(instance)
  } else if (instance.type === 'CASH_BACK') {
    savedInstance.savedData.cash_back = initializeCashBack(instance)
  } else if (instance.type === 'EARLY_BOOKING') {
    savedInstance.savedData.early_booking = initializeEarlyBooking(instance)
  }
  savedInstance.context = context;
  SavedInstanceController.createSavedInstance(savedInstance, callback)
}

function createRealizationCode() {
  return randomstring.generate({length: 10, charset: 'alphanumeric'});
}

function relateSavedInstance(userId, savedInstance, instance, callback) {
  let realize_code = createRealizationCode();
  let save_time = new Date();
  instance.realize_code = realize_code;
  instance.save_time = save_time;
  graphModel.relate_ids(userId, 'SAVED', savedInstance._id, `{code: '${realize_code}',timestamp: '${save_time}'}`, function (err) {
    if (err) {
      return callback(err)
    }
    graphModel.relate_ids(savedInstance._id, 'SAVE_OF', instance._id, `{timestamp: '${save_time}'}`, function (err) {
      if (err) {
        return callback(err)
      }
      return callback(null, instance);
    });
  });
}

function saveInstance(userId, instance, context, callback) {
  graphModel.query(`MATCH (i:instance { _id:'${instance._id}'}) return i.quantity as quantity`, function (err, results) {
    if (err) {
      return callback(err);
    }
    if (results.length !== 1 && results[0].quantity < 1) {
      return callback(new Error('Run out of instances'));
    }
    createSavedInstance(instance, userId, context, function (err, savedInstance) {
      if (err) return callback(err);
      relateSavedInstance(userId, savedInstance, instance, function (err, instance) {
        if (err) return callback(err);
        graphModel.query(`MATCH (i:instance { _id:'${instance._id}'}) SET i.quantity=i.quantity-1`, function (err) {
          if (err) return callback(err);
          SavedInstance.findById(savedInstance._id).exec((err, si) => {
            if (err) return callback(err);
            graphModel.relate_ids(userId, 'SAVED', instance.promotion._id);
            return callback(null, si);
          })
        });
      });
    });
  });
}

function isRealizedInstance(status) {
  return status.map(s => s.status === 'REALIZED' || s.status === 'SAVED')
    .reduce((accumulator, currentValue) => accumulator || currentValue, false);
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
        if (isRealizedInstance(status)) {
          const err = new Error(`Can not save instance type of ${status[0].type}, in case it was used or redeemed`);
          console.error(err);
          return res.status(500).json(err);
        }
        return saveInstance(req.user._id, instance, {}, (err, si) => {
          if (err) handleError(res, err);
          return res.status(200).json(si);
        })
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

function createRealizeMongodbReport(user_id, instance_id, callback) {
  Realize.create({
    user: user_id,
    instance: instance_id,
    timestamp: Date.now()
  }, function (err, realize) {
    if (err) {
      console.error(err);
      return callback(err)
    }
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
        if (!instance.realizations) instance.realizations = [];
        instance.realizations.push(realize._id);
        instance.save(function (err) {
          if (err) {
            return callback(err)
          }
          return callback(null, instance);
        });
      })
  });
}

function firstSecondRedeemTimeLogic(obj, callback) {
  if (obj.firstRedeemTime && obj.secondRedeemTime)
    return callback(new Error('first and second redeem time already set'));
  if (!obj.firstRedeemTime)
    obj.firstRedeemTime = Date.now();
  else
    obj.secondRedeemTime = Date.now();
  return callback(null, obj);
}

function redeemTimeLogic(obj, callback) {
  if (obj.redeemTime)
    return callback(new Error('redeem time already set'));
  obj.redeemTime = Date.now();
  return callback(null, obj);
}

function savedInstanceEligibleActivity(userId, savedInstance) {
  Instance.findById(savedInstance.instance).exec((err, instance) => {
    if (err) return console.error(err);
    if (!instance) return console.error(new Error(`instance id:${savedInstance.instance} not found`));
    let act = {
      savedInstance: savedInstance._id,
      instance: instance._id,
      promotion: instance.promotion._id,
      ids: [userId],
      action: 'saved_instance_eligible'
    };
    const entity = instance.promotion.entity;
    act.actor_business = entity.business;
    activity.create(act, function (err, activity) {
      if (err) return console.error(err);
      pricing.chargeActivityDistribution(entity, activity);
    });
  })
}

function allocatePunchCardInstance(user, instance, callback) {
  graphModel.query(`MATCH (i:instance { _id:'${instance.id}'}) return i.quantity as quantity`, function (err, results) {
    if (err) {
      return callback(err);
    }
    if (results.length >= 1 && results[0].quantity > 0) {
      graphModel.query(`MATCH (i:instance { _id:'${instance.id}'}) SET i.quantity=i.quantity-1`, function (err) {
        if (err) return callback(err);
        createSavedInstance(instance, user._id, {}, (err, si) => {
          if (err) callback(err);
          relateSavedInstance(user._id, si, instance, (err => {
            if (err) return callback(err);
            savedInstanceEligibleActivity(user._id, si);
            let note = {
              note: 'saved_instance_eligible',
              savedInstance: si._id,
              title: 'RE_PROMOTION_ELIGIBLE_TITLE',
              body: instance.promotion ? instance.promotion.name : '',
              timestamp: Date.now()
            };
            Notifications.notifyUser(note, user._id, true);
          }));
        });
      });
    }
  });
}

function redeemPunchCard(saved, callback) {
  let punch_card = saved.savedData.punch_card;

  function punch(saved, callback) {
    const query = `MATCH (:instance)<-[sf:SAVE_OF]-(saved:SavedInstance)<-[r:SAVED]-(:user{ _id: '${saved.user._id}'})
                      where saved._id = '${saved._id}' and saved.type = 'PUNCH_CARD'
                      return saved`;
    graphModel.query(query, function (err, savedInstances) {
      if (err) {
        return callback(err);
      }
      if (savedInstances.length !== 1) {
        return callback(new Error(`Expecting exactly one not yet redeemed punch card found ${savedInstances.length}`));
      }
      const query = `MATCH (:instance)<-[sf:SAVE_OF]-(saved:SavedInstance)<-[r:SAVED]-(:user{ _id: '${saved.user._id}'})
                      where saved._id = '${saved._id}' and saved.type = 'PUNCH_CARD'
                      set r.code = '${createRealizationCode()}'`;
      graphModel.query(query, callback)
    })
  }

  if (punch_card.won) return callback(new Error('punch card already market as won'));
  else if (punch_card.redeemTimes.length >= punch_card.number_of_punches) return callback(new Error('punch card already won by number of punches'));
  else if (punch_card.redeemTimes.length === punch_card.number_of_punches - 1) {
    punch_card.redeemTimes.push(Date.now());
    punch_card.redeemTimes.won = true;
    saved.save(function (err, savedInstance) {
      if (err) return callback(err);
      //mark as won in graphDB as well
      graphModel.query(`MATCH (saved:SavedInstance) 
                        WHERE saved._id = '${saved._id}' 
                        SET saved.won = true;
                        `, (err) => {
        if (err) console.error(err)
      });
      allocatePunchCardInstance(saved.user, saved.instance);
      return callback(null, {
        terminate: true,
        savedInstance: savedInstance
      })
    })
  }
  else if (punch_card.redeemTimes.length < punch_card.number_of_punches - 1) {
    punch(saved, function (err) {
      if (err) return callback(err);
      punch_card.redeemTimes.push(Date.now());
      saved.save(function (err, savedInstance) {
        if (err) return callback(err);
        return callback(null, {
          terminate: false,
          savedInstance: savedInstance
        })
      })
    })
  }
}

function redeemSavedInstance(saved, callback) {
  redeemTimeLogic(saved.savedData.other, function (err, other) {
    if (err) return callback(err);
    saved.savedData.other = other;
    if (err) return callback(err);
    saved.save(function (err, saved) {
      if (err) return callback(err);
      return callback(null, {
        terminate: true,
        savedInstance: saved
      })
    })
  })
}

function redeemIncreasing(saved, callback) {
  firstSecondRedeemTimeLogic(saved.savedData.increasing, function (err, increasing) {
    if (err) return callback(err);
    saved.savedData.increasing = increasing;
    saved.save(function (err, saved) {
      if (err) return callback(err);
      return callback(null, {
        terminate: increasing.firstRedeemTime && increasing.secondRedeemTime,
        savedInstance: saved
      })
    })
  })
}

function redeemDoubling(saved, callback) {
  firstSecondRedeemTimeLogic(saved.savedData.doubling, function (err, doubling) {
    if (err) return callback(err);
    saved.savedData.doubling = doubling;
    if (doubling.firstRedeemTime && doubling.secondRedeemTime)
      saved.savedData.doubling.value = 2 * saved.savedData.doubling.value;
    saved.save(function (err, saved) {
      if (err) return callback(err);
      return callback(null, {
        terminate: doubling.firstRedeemTime && doubling.secondRedeemTime,
        savedInstance: saved
      })
    })
  })
}

function redeemGrow(saved, callback) {
  firstSecondRedeemTimeLogic(saved.savedData.grow, function (err, grow) {
    if (err) return callback(err);
    saved.savedData.grow = grow;
    if (grow.firstRedeemTime && !grow.secondRedeemTime)
      saved.savedData.grow.value = grow.value + grow.by;
    saved.save(function (err, saved) {
      if (err) return callback(err);
      return callback(null, {
        terminate: grow.firstRedeemTime && grow.secondRedeemTime,
        savedInstance: saved
      })
    })
  })
}

function redeemPrepayDiscount(saved, callback) {
  firstSecondRedeemTimeLogic(saved.savedData.prepay, function (err, prepay) {
    if (err) return callback(err);
    saved.savedData.prepay = prepay;
    saved.save(function (err, saved) {
      if (err) callback(err);
      if ((prepay.firstRedeemTime && prepay.secondRedeemTime) &&
        !(prepay.firstRedeemTime <= Date.now() && Date.now() <= prepay.secondRedeemTime )) {
        if (err) return callback(new Error('redeem time out of range'));
      }
      return callback(null, {
        terminate: prepay.firstRedeemTime && prepay.secondRedeemTime,
        savedInstance: saved
      })
    })
  })
}

function redeemCashBack(saved, callback) {
  redeemTimeLogic(saved.savedData.cash_back, function (err, cash_back) {
    if (err) return callback(err);
    saved.savedData.cash_back = cash_back;
    if (err) return callback(err);
    saved.save(function (err, saved) {
      if (err) return callback(err);
      return callback(null, {
        terminate: true,
        savedInstance: saved
      })
    })
  })
}

function redeemEarlyBooking(saved, callback) {
  redeemTimeLogic(saved.savedData.early_booking, function (err, early_booking) {
    if (err) return callback(err);
    saved.savedData.early_booking = early_booking;
    if (err) return callback(err);
    saved.save(function (err, saved) {
      if (err) return callback(err);
      return callback(null, {
        terminate: true,
        savedInstance: saved
      })
    })
  })
}

function redeemHappyHour(saved, data, callback) {
  let happy_hour = saved.savedData.happy_hour;

  function realize_happy_hour(saved, callback) {
    const query = `MATCH (:instance)<-[sf:SAVE_OF]-(saved:SavedInstance)<-[r:SAVED]-(:user{ _id: '${saved.user._id}'})
                      where saved._id = '${saved._id}' and saved.type = 'HAPPY_HOUR'
                      return saved`;
    graphModel.query(query, function (err, savedInstances) {
      if (err) {
        return callback(err);
      }
      if (savedInstances.length !== 1) {
        return callback(new Error(`Expecting exactly one not yet redeemed punch card found ${savedInstances.length}`));
      }
      const query = `MATCH (:instance)<-[sf:SAVE_OF]-(saved:SavedInstance)<-[r:SAVED]-(:user{ _id: '${saved.user._id}'})
                      where saved._id = '${saved._id}' and saved.type = 'HAPPY_HOUR'
                      set r.code = '${createRealizationCode()}'`;
      graphModel.query(query, callback)
    })
  }

  if (!data || !data.day || !data.hours || !data.minutes) {
    const err = new Error(`data object is not preset or not valid ${JSON.stringify(data)}`);
    console.error(err);
    return callback(err);
  }
  realize_happy_hour(saved, function (err) {
    if (err) return callback(err);
    if (!data || !data.day || !data.hours || !data.minutes) {
      return callback(new Error('data object is not preset or not valid'));
    }
    let now_seconds = data.hours * 60 * 60 + data.minutes * 60;
    if (happy_hour.days.includes(data.day) &&
      happy_hour.from <= now_seconds && now_seconds <= happy_hour.until) {
      happy_hour.redeemTimes.push(Date.now());
      saved.save(function (err, savedInstance) {
        if (err) return callback(err);
        return callback(null, {
          terminate: false,
          savedInstance: savedInstance
        })
      })
    } else
      return callback(new Error('Redeem is out of happy hour time'))
  });
}

function handleRealizeBySavedInstanceType(userId, saved, data, callback) {
  function doHandle() {
    let type = saved.instance.type;
    switch (type) {
      case 'INCREASING':
        return redeemIncreasing(saved, callback);
      case 'DOUBLING':
        return redeemDoubling(saved, callback);
      case 'GROW':
        return redeemGrow(saved, callback);
      case 'PREPAY_DISCOUNT':
        return redeemPrepayDiscount(saved, callback);
      case 'PUNCH_CARD':
        return redeemPunchCard(saved, callback);
      case 'HAPPY_HOUR':
        return redeemHappyHour(saved, data, callback);
      case 'CASH_BACK':
        return redeemCashBack(saved, callback);
      case 'EARLY_BOOKING':
        return redeemEarlyBooking(saved, callback);
      default:
        return redeemSavedInstance(saved, callback);
    }
  }

  if (saved.instance.card) {
    cardController.doRedeem(userId,
      saved.instance.card.cardType._id,
      saved.instance.card.points,
      (err) => {
        if (err) return callback(err);
        return doHandle();
      })
  } else {
    return doHandle();
  }
}

function realizeSavedInstance(user, savedInstance, rel, res, data) {
  SavedInstance.findById(savedInstance._id).exec(function (err, saved) {
    if (err) return handleError(res, err);
    if (!saved) return handleError(res, new Error('no saved Instance found'));
    handleRealizeBySavedInstanceType(user._id, saved, data, function (err, status) {
      if (err) return handleError(res, err);
      let terminate = status.terminate;
      let savedInstance = status.savedInstance;
      fireEvent.info('user', user._id, 'saved_instance_realized', {savedInstance: savedInstance._id.toString()});
      if (terminate) {
        graphModel.relate_ids(user._id, 'REALIZED', savedInstance._id, `{code: '${rel.properties.code}', timestamp: '${ new Date()}'}`, function (err) {
          if (err) return handleError(res, err);
          graphModel.unrelate_ids(user._id, 'SAVED', savedInstance._id, function (err) {
            if (err) return handleError(res, err);
            createRealizeMongodbReport(user._id, savedInstance.instance._id, function (err, instance) {
              if (err) return handleError(res, err);
              savedInstance.instance = instance;
              return res.status(200).json({savedInstance});
            });
          })
        })
      } else {
        return res.status(200).json({savedInstance});
      }
    });
  });
}

//TODO: validate sale_point_code
exports.realize = function (req, res) {
  const query = `MATCH (promotion:promotion)<-[:INSTANCE_OF]-(instance:instance)<-[sf:SAVE_OF]-(savedInstance:SavedInstance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user) 
                return promotion,instance, savedInstance, rel,user`;
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
          if (barcodes[0].barcode !== req.params.barcode)
            return res.status(403).send('required barcode mismatch');
          return realizeSavedInstance(user, savedInstance, rel, res, {});
        });
    } else {
      return realizeSavedInstance(user, savedInstance, rel, res, {});
    }
  });
};
//TODO: validate sale_point_code
exports.post_realize = function (req, res) {
  const query = `MATCH (promotion:promotion)<-[:INSTANCE_OF]-(instance:instance)<-[sf:SAVE_OF]-(savedInstance:SavedInstance)<-[rel:SAVED{code: '${req.params.code}'}]-(user:user) 
                return promotion,instance, savedInstance, rel,user`;
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
          if (barcodes[0].barcode !== req.params.barcode)
            return res.status(403).send('required barcode mismatch');
          return realizeSavedInstance(user, savedInstance, rel, res, req.body || {});
        });
    } else {
      return realizeSavedInstance(user, savedInstance, rel, res, req.body || {});
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
exports.qrcode = function (req, res) {
  const query = `MATCH (savedInstance:SavedInstance{_id:"${req.params.id}"})<-[rel:SAVED]-(user:user{_id:"${req.user._id}"}) return rel.code`;
  graphModel.query(query, function (err, codes) {
    if (err) return handleError(res, err);
    if (codes.length === 0)
      return res.status(404).send(`realize code mismatch`);
    if (codes.length > 1) {
      console.error(`multiple instances found for ${req.params.id}`);
      return res.status(500).send('multiple instances found');
    }
    const r_query = `MATCH (savedInstance:SavedInstance{_id:"${req.params.id}"})<-[rel:REALIZED]-(user:user{_id:"${req.user._id}"}) return rel`;
    graphModel.query(r_query, function (err, reals) {
      if (err) return handleError(res, err);
      if (reals.length > 1) {
        console.error(`already realized ${req.params.id}`);
        return res.status(412).send(err);
      }
      QRCode.toDataURL(JSON.stringify({
        t: 'i',
        code: codes[0]['rel.code']
      }), function (err, url) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        } else {
          return res.status(200).json({
            qrcode: url
          });
        }
      });
    });
  })
};

function handleError(res, err) {
  console.error(err);
  return res.status(500).send(err.message);
}
