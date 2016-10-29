'use strict';

var express = require('express');
var controller = require('./group.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.get('/add/user/:user/:to_group', auth.isAuthenticated(), controller.add_user);
router.get('/add/group/:group/:to_group', auth.isAuthenticated(), controller.add_group);
router.get('/following/groups/:group/:skip/:limit/', auth.isAuthenticated(), controller.following_groups);
router.get('/following/users/:group/:skip/:limit/', auth.isAuthenticated(), controller.following_users);
router.post('/offer/:group', auth.isAuthenticated(), controller.offer);
router.post('/message/:group', auth.isAuthenticated(), controller.message);


module.exports = router;




