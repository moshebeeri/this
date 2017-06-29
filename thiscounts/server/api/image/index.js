'use strict';

let express = require('express');
let controller = require('./image.controller.js');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.post('/:id', auth.isAuthenticated(), controller.create);
router.post('/base64/:id', auth.isAuthenticated(), controller.base64_create);
router.post('/logo/:id', auth.isAuthenticated(), controller.logo);
router.post('/logo/base64/:id', auth.isAuthenticated(), controller.base64_logo);
router.get('/order/:id/:date/:order', auth.isAuthenticated(), controller.order);
router.get('/delete/:id/:date', auth.isAuthenticated(), controller.delete);

module.exports = router;
