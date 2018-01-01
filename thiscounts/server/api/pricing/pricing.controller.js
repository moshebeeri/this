'use strict';

let _ = require('lodash');
let Pricing = require('./pricing.model').Pricing;
const async = require('async');
const Business = require('../business/business.model');
const ShoppingChain = require('../shoppingChain/shoppingChain.model');
const Mall = require('../mall/mall.model');
const Brand = require('../brand/brand.model');
const Instance = require('../instance/instance.model');
const activity = require('../../components/activity').createActivity();
const pricing = require('../../components/pricing');

exports.test = function (req, res) {
  Instance.findById("593da112e1977d1f651a4746", function (err, instance) {
      if (err) return handleError(res, err);

      let act = {
        instance: instance._id,
        promotion: instance.promotion._id,
        ids: ['5935a132e33011902c4b6377'],
        action: "eligible"
      };
      act.actor_business = instance.promotion.entity.business;
      activity.create(act, function (err, activity) {
        if (err) return handleError(res, err);
        pricing.balance(instance.promotion.entity, function (err) {
          if(err) return handleError(res, err);
          pricing.chargeActivityDistribution(instance.promotion.entity, activity);
          return res.status(200).send('pricing test');
        })
      });
    });
};


function findEntity(id, callback) {
  async.parallel({
      business: function (callback) {
        Business.findById(id, callback);
      },
      shoppingChain: function (callback) {
        ShoppingChain.findById(id, callback);
      },
      mall: function (callback) {
        Mall.findById(id, callback);
      },
      brand: function (callback) {
        Brand.findById(id, callback);
      },
    },
    function (err, results) {
      if (err)
        return callback(err, null);

      for (let key in results) {
        let updated = results[key];
        if (updated) {
          return callback(null, updated);
        }
      }
      return callback(null, null);
    })
}

function entityPricing(entity, callback) {
  if (entity.pricing)
    return callback(null, entity);
  Pricing.create({
    freeTier: [{
      date: Date.now(),
      points: 100000
    }],
    purchases: [],
    points: 100000,
    lastFreeTier: pricing.firstOfThisMonth()
  }, function (err, pricing) {
    entity.pricing = pricing;
    entity.save(callback);
  })
}

exports.createEntityPricing = function (entity, callback) {
  return entityPricing(entity, callback);
};

exports.braintree = function (req, res) {
  //payment received through braintree gateway
  findEntity(req.params.id, function (err, entity) {
    if (!entity) {
      return res.status(404).send('Not Found');
    }
    entityPricing(entity, function (err, entity) {
      if (err) {
        return handleError(res, err);
      }
      let pricing = entity.pricing;
      if (!pricing.purchases) pricing.purchases = [];
      if (!pricing.points) pricing.points = 0;

      const purchasedPoints = {
        user: req.user._id,
        date: Date.now(),
        payed: 1,
        currency: '$',
        points: 10000
      };
      pricing.purchases.push(purchasedPoints);
      pricing.points += purchasedPoints.points;
      pricing.save(function (err, entity) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(entity.pricing);
      });
    })
  })
};

exports.freeTier = function (req, res) {
  findEntity(req.params.id, function (err, entity) {
    if (!entity) {
      return res.status(404).send('Not Found');
    }
    entityPricing(entity, function (err, entity) {
      if (err) {
        return handleError(res, err);
      }
      let pricing = entity.pricing;
      if (!pricing.freeTier) pricing.freeTier = [];
      if (!pricing.points) pricing.points = 0;
      const freePoints = {
        date: Date.now(),
        points: 100000
      };
      pricing.freeTier.push(freePoints);
      pricing.points += freePoints.points;
      pricing.save(function (err, entity) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(entity.pricing);
      });
    })
  })
};

// Get list of pricing
exports.index = function (req, res) {
  Pricing.find(function (err, pricings) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(pricings);
  });
};

// Get a single pricing
exports.show = function (req, res) {
  Pricing.findById(req.params.id, function (err, pricing) {
    if (err) {
      return handleError(res, err);
    }
    if (!pricing) {
      return res.status(404).send('Not Found');
    }
    return res.json(pricing);
  });
};

// Creates a new pricing in the DB.
exports.create = function (req, res) {
  Pricing.create(req.body, function (err, pricing) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, pricing);
  });
};

// Updates an existing pricing in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Pricing.findById(req.params.id, function (err, pricing) {
    if (err) {
      return handleError(res, err);
    }
    if (!pricing) {
      return res.status(404).send('Not Found');
    }
    let updated = _.merge(pricing, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(pricing);
    });
  });
};

// Deletes a pricing from the DB.
exports.destroy = function (req, res) {
  Pricing.findById(req.params.id, function (err, pricing) {
    if (err) {
      return handleError(res, err);
    }
    if (!pricing) {
      return res.status(404).send('Not Found');
    }
    pricing.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  console.error(err);
  return res.status(500).send(err);
}