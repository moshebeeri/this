'use strict';

let express = require('express');
let controller = require('./group.controller');
let auth = require('../../auth/auth.service');
let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);

router.get('/user/candidates/:group/:skip/:limit', auth.isAuthenticated(), controller.user_candidates);
router.get('/candidates/:group/:skip/:limit', auth.isAuthenticated(), controller.small_business_candidates);
router.get('/candidates/:group/:business/:skip/:limit', auth.isAuthenticated(), controller.business_candidates);

router.get('/touch/:group_id', auth.isAuthenticated(), controller.touch);
router.get('/join/group/:group/:group2follow', auth.isAuthenticated(), controller.group_join_group);
router.get('/follow/:group/:business', auth.isAuthenticated(), controller.group_follow_business);
router.get('/following/:business/:skip/:limit', auth.isAuthenticated(), controller.groups_following_business);
router.get('/join/:group', auth.isAuthenticated(), controller.join_group);

router.get('/join/ask/:group', auth.isAuthenticated(), controller.ask_join_group);
router.get('/join/approve/:user/:group', auth.isAuthenticated(), controller.approve_join_group);

router.get('/invite/ask/:group/:user', auth.isAuthenticated(), controller.invite_group);
router.get('/invite/approve/:group', auth.isAuthenticated(), controller.approve_invite_group);

router.get('/add/user/:user/:to_group', auth.isAuthenticated(), controller.add_user);
router.post('/add/users/:to_group', auth.isAuthenticated(), controller.add_users);
router.post('/add/admin/:user/:to_group', auth.isAuthenticated(), controller.add_admin);

router.get('/following/groups/:group/:skip/:limit', auth.isAuthenticated(), controller.following_groups);
router.get('/following/users/:group/:skip/:limit', auth.isAuthenticated(), controller.following_users);
router.get('/user/follow/:skip/:limit', auth.isAuthenticated(), controller.user_follow);
//This REST API is not yet functional
router.get('/following/:group/:skip/:limit', auth.isAuthenticated(), controller.following);
router.post('/message/:group', auth.isAuthenticated(), controller.message);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;




