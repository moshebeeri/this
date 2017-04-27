'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/list/create/by/user/:skip/:limit', auth.isAuthenticated(), controller.user_products);


router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:skip/:limit', auth.isAuthenticated(), controller.index_paginated);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(),  controller.destroy);
router.get('/find/by/business/:id', auth.isAuthenticated(), controller.find_by_business);

module.exports = router;
