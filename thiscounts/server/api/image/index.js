'use strict';

var express = require('express');
var controller = require('./image.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/:id', auth.isAuthenticated(), controller.create);
router.post('/base64/:id', auth.isAuthenticated(), controller.base64_create);
router.post('/logo/:id', auth.isAuthenticated(), controller.logo);
router.post('/base64/:id', auth.isAuthenticated(), controller.base64_logo);
router.get('/order/:id/:date/:order', auth.isAuthenticated(), controller.order);
router.get('/delete/:id/:date', auth.isAuthenticated(), controller.delete);

module.exports = router;
