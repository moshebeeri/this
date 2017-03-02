'use strict';

var express = require('express');
var controller = require('./image.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/:id', auth.isAuthenticated(), controller.create);
router.post('/base64/:id', controller.base64_create);
router.post('/logo/:id', auth.isAuthenticated(), controller.logo);
router.post('/base64/:id', controller.base64_logo);
//router.put('/', auth.isAuthenticated(), controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
