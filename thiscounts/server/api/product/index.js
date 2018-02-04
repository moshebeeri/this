'use strict';

let express = require('express');
let controller = require('./product.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);
router.get('/list/create/by/user/:skip/:limit', auth.isAuthenticated(), controller.user_products);


router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:skip/:limit', auth.isAuthenticated(), controller.index_paginated);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(),  controller.destroy);
router.post('/entity/scroll/:entity/:from/:scroll', auth.isAuthenticated(), controller.scroll);
router.post('/sold/by/:barcode/:from/:scroll', auth.isAuthenticated(), controller.selling_businesses);
router.post('/branded/by/:product', auth.isAuthenticated(), controller.branded);
router.post('/selling/brand/:brand', auth.isAuthenticated(), controller.business_selling_brand);
router.post('/eligible/:from/:scroll', auth.isAuthenticated(), controller.eligible_products);

router.get('/find/by/business/:id', auth.isAuthenticated(), controller.find_by_business);
router.get('/find/by/barcode/:barcode/skip/limit', auth.isAuthenticated(), controller.find_by_barcode);

module.exports = router;
