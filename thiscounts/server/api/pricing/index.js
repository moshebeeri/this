'use strict';

let express = require('express');
let controller = require('./pricing.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

//see https://github.com/braintree/braintree_express_example/blob/master/routes/index.js
router.get('/checkouts/new', auth.isAuthenticated(), controller.checkouts_new);
router.get('/checkouts/:id', auth.isAuthenticated(), controller.checkouts_id);
router.post('/checkouts', auth.isAuthenticated(), controller.checkouts);

router.get('/create/pricing/:entity', auth.isAuthenticated(), controller.pricing);

router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/', auth.hasRole('admin'), controller.index);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
