'use strict';

let express = require('express');
let controller = require('./business.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/test/:user/:entity', controller.test);
//router.get('/test/email', controller.test_email);

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);
router.post('/checkAddress', auth.isAuthenticated(), controller.check_address);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/pictures/:id', auth.isAuthenticated(), controller.update_pictures);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/agent/approve/:business/:code', controller.agent_approve_business);
router.get('/letterOfIncorporation/:id', controller.letterOfIncorporation);
router.get('/identificationCard/:id', controller.identificationCard);
router.get('/validate/email/:id/:code', controller.validate_email);
router.get('/update/email/:id/:email', controller.update_email);
router.get('/review/:id/:status', controller.review);
router.get('/list/mine', auth.isAuthenticated(), controller.mine);
router.get('/follow/:business', auth.isAuthenticated(), controller.follow);
router.delete('/follow/:business', auth.isAuthenticated(), controller.un_follow);
router.get('/followers/:business/:skip/:limit', auth.isAuthenticated(), controller.followers);
router.get('/users/following/:business/:skip/:limit', auth.isAuthenticated(), controller.following_users);
router.get('/groups/following/:business/:skip/:limit', auth.isAuthenticated(), controller.following_groups);
router.get('/users/following/default/group/:business/:skip/:limit', auth.isAuthenticated(), controller.users_following_default_group);
router.get('/groups/following/default/group/:business/:skip/:limit', auth.isAuthenticated(), controller.groups_following_default_group);
router.get('/user/businesses/by/phone/:country_code/:phone', auth.isAuthenticated(), controller.getUserBusinessesByPhone);

module.exports = router;
