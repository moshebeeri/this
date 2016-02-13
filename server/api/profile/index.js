'use strict';

var express = require('express');
var controller = require('./profile.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
//router.get('/:id', auth.isAuthenticated(), controller.show);
//router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', auth.isAuthenticated(), controller.update);
//router.patch('/:id', auth.isAuthenticated(), controller.update);
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.get('/me', auth.isAuthenticated(), controller.me);


module.exports = router;
