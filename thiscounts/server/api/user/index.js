'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/password/:phone_number', controller.recover_password);
router.get('/verification/:code', auth.isAuthenticated(), controller.verification);
router.get('/verify', auth.isAuthenticated(), controller.verify);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/phone_number/:phone_number', auth.isAuthenticated(), controller.showByPhone);
router.post('/', controller.create);
router.get('/like/:id', auth.isAuthenticated(), controller.like);
router.delete('/like/:id', auth.isAuthenticated(), controller.unlike);
router.get('/share/:id', auth.isAuthenticated(), controller.share);
router.post('/phonebook', auth.isAuthenticated(), controller.phonebook);
router.get('/follow/:id', auth.isAuthenticated(), controller.follow);
router.delete('/follow/:id', auth.isAuthenticated(), controller.unfollow);


module.exports = router;
