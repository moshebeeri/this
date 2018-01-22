'use strict';

let express = require('express');
let controller = require('./shoppingChain.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);
router.get('/add/business/:chainId/:businessId', auth.isAuthenticated(), controller.addBusinessToChain);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/:businessId', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
