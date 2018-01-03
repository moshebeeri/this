'use strict';

let express = require('express');
let controller = require('./pricing.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

//router.get('/test', controller.test);

//see https://github.com/braintree/braintree_express_example/blob/master/routes/index.js
router.get('/checkouts/new', controller.checkouts_new);
router.get('/checkouts/:id', controller.checkouts_id);
router.post('/checkouts', controller.checkouts);

//router.get('/payment/braintree/:entity/:nonce', auth.isAuthenticated(), controller.braintree);
router.get('/request/freeTier/:entity', auth.isAuthenticated(), controller.freeTier);

router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/', auth.hasRole('admin'), controller.index);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
