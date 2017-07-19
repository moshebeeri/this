'use strict';

let express = require('express');
let controller = require('./group.controller');
let auth = require('../../auth/auth.service');
let router = express.Router();

router.get('/touch/:group_id', auth.isAuthenticated(), controller.touch);
router.get('/join/group/:group/:group2follow', auth.isAuthenticated(), controller.group_join_group);
router.get('/follow/:group/:business', auth.isAuthenticated(), controller.group_follow_business);
router.get('/following/:business/:skip/:limit', auth.isAuthenticated(), controller.groups_following_business);
router.get('/join/:group', auth.isAuthenticated(), controller.join_group);

router.get('/add/user/:user/:to_group', auth.isAuthenticated(), controller.add_user);
router.post('/add/users/:to_group', auth.isAuthenticated(), controller.add_users);
router.post('/add/admin/:user/:to_group', auth.isAuthenticated(), controller.add_admin);

router.get('/following/groups/:group/:skip/:limit', auth.isAuthenticated(), controller.following_groups);
router.get('/following/users/:group/:skip/:limit', auth.isAuthenticated(), controller.following_users);
router.get('/user/follow/:skip/:limit', auth.isAuthenticated(), controller.user_follow);
//This REST API is not yet functional
router.get('/following/:group/:skip/:limit', auth.isAuthenticated(), controller.following);
router.get('/my/groups/:skip/:limit', auth.isAuthenticated(), controller.my_groups);
//router.post('/offer/:group', auth.isAuthenticated(), controller.offer);
router.post('/message/:group', auth.isAuthenticated(), controller.message);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;




