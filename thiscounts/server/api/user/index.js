'use strict';

let express = require('express');
let controller = require('./user.controller');
let config = require('../../config/environment');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/password/:phone_number', controller.recover_password);
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

router.get('/role/:user/:role/:entity', auth.isAuthenticated(), controller.addEntityUserRole);
router.delete('/role/:user/:role/:entity', auth.isAuthenticated(), controller.deleteEntityUserRole);
router.get('/role/test', controller.roleTest);

module.exports = router;
