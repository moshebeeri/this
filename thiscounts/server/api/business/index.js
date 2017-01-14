'use strict';

var express = require('express');
var controller = require('./business.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/mine', auth.isAuthenticated(), controller.mine);
router.post('/add/users/:to_group', auth.isAuthenticated(), controller.add_users);
router.get('/following/user', auth.isAuthenticated(), controller.following_user);

module.exports = router;
