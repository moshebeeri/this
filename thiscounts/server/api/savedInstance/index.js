'use strict';

let express = require('express');
let controller = require('./savedInstance.controller.js');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/qrcode/:code', auth.isAuthenticated(), controller.qrcode);
router.get('/by/instance/:id', auth.isAuthenticated(), controller.byInstance);


module.exports = router;
