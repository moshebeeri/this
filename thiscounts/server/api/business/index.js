'use strict';

let express = require('express');
let controller = require('./business.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);
router.post('/checkAddress', auth.isAuthenticated(), controller.check_address);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/list/mine', auth.isAuthenticated(), controller.mine);
router.get('/follow/:business', auth.isAuthenticated(), controller.follow);

module.exports = router;
