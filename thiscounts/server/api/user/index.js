'use strict';

let express = require('express');
let controller = require('./user.controller');
let config = require('../../config/environment');
let auth = require('../../auth/auth.service');

let router = express.Router();


router.get('/', auth.hasRole('admin'), controller.index);
router.get('/terms/:ver', controller.terms);
router.get('/server/version', auth.isAuthenticated(), controller.version);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/password/:phone_number', controller.recover_password);
router.get('/refresh/token',  auth.isAuthenticated(), controller.refresh_token);
router.get('/verification/:code', auth.isAuthenticated(), controller.verification);
router.get('/verify', auth.isAuthenticated(), controller.verify);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/', auth.isAuthenticated(), controller.updateInfo);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/phone_number/:phone_number', auth.isAuthenticated(), controller.showByPhone);
router.post('/', controller.create);
router.get('/like/:id', auth.isAuthenticated(), controller.like);
router.delete('/like/:id', auth.isAuthenticated(), controller.unlike);
router.get('/share/:id', auth.isAuthenticated(), controller.share);
router.post('/phonebook', auth.isAuthenticated(), controller.phonebook);
router.get('/follow/:id', auth.isAuthenticated(), controller.follow);
router.delete('/follow/:id', auth.isAuthenticated(), controller.unfollow);
router.get('/followers/:skip/:limit', auth.isAuthenticated(), controller.followers);
router.get('/following/:skip/:limit', auth.isAuthenticated(), controller.following);
router.get('/suggest/businesses', auth.isAuthenticated(), controller.suggest_businesses);


router.get('/roles', auth.isAuthenticated(), controller.roles);
router.get('/role/:user/:role/:entity', auth.isAuthenticated(), controller.addEntityUserRole);
router.get('/role/by/phone/:country_code/:phone/:role/:entity', auth.isAuthenticated(), controller.addEntityUserRoleByPhone);
router.delete('/role/:user/:entity', auth.isAuthenticated(), controller.deleteEntityUserRole);
router.get('/roles/:role/:entity/:skip/:limit', auth.isAuthenticated(), controller.entityRoles);
router.get('/roles/:entity/:skip/:limit', auth.isAuthenticated(), controller.entityRoles);
router.get('/get/user/by/phone/:country_code/:phone', auth.isAuthenticated(), controller.getUserByPhone);

module.exports = router;
