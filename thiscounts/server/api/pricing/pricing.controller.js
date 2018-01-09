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
const config = require('../../config/environment');

/*exports.test = function (req, res) {
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
};*/


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
      points: config.pricing.freeTier
    }],
    purchases: [],
    freeTierPoints: config.pricing.freeTier,
    purchasedPoints: 0,
    lastFreeTier: pricing.firstOfThisMonth()
  }, function (err, pricing) {
    entity.pricing = pricing;
    entity.save(callback);
  })
}

exports.createEntityPricing = function (entity, callback) {
  return entityPricing(entity, callback);
};

/*
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
*/

exports.pricing = function (req, res) {
  findEntity(req.params.entity, function (err, entity) {
    if (!entity) {
      return res.status(404).send('Not Found');
    }
    entityPricing(entity, function (err, entity) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(entity);
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

////////////////////////////////////////////////
//// see: https://github.com/braintree/braintree_express_example/blob/master/routes/index.js

let braintree = require('braintree');
let gateway;

//require('dotenv').load(); process.env.BT_MERCHANT_ID;
//environment = process.env.BT_ENVIRONMENT.charAt(0).toUpperCase() + process.env.BT_ENVIRONMENT.slice(1);

gateway = braintree.connect({
  environment: braintree.Environment.Sandbox, //braintree.Environment['Sandbox']
  merchantId: 'hhk8bks2bxdrp7jm',
  publicKey: 'f7dt4jczwvx2vkxg',
  privateKey: '265da49809261f3bbafe1ab8068cae62'
});


let TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];


function formatErrors(errors) {
  let formattedErrors = '';

  for (let i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
    }
  }
  return formattedErrors;
}

function createResultObject(transaction) {
  let result;
  let status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
    };
  }

  return result;
}

// GET /checkouts/new
exports.checkouts_new = function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    if(err) return handleError(res, err);
    return res.status(200).json({clientToken: response.clientToken});
  });
};

// GET /checkouts/:id
exports.checkouts_id = function (req, res) {
  let result;
  let transactionId = req.params.id;

  gateway.transaction.find(transactionId, function (err, transaction) {
    if(err) return handleError(res, err);
    result = createResultObject(transaction);
    console.log(JSON.stringify(transaction));
    return res.status(200).json({transaction: transaction, result: result});

  });
};

// POST /checkouts
exports.checkouts = function (req, res) {
  let transactionErrors;
  let amount = req.body.amount; // In production you should not take amounts directly from clients
  let nonce = req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.redirect('' + result.transaction.id);
    } else {
      transactionErrors = result.errors.deepErrors();
      //req.flash('error', {msg: formatErrors(transactionErrors)});
      res.redirect('new');
    }
  });
};
//////////////////////////

function handleError(res, err) {
  console.error(err);
  return res.status(500).send(err);
}
