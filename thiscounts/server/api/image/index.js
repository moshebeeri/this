'use strict';

let express = require('express');
let controller = require('./image.controller.js');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/create/image', auth.isAuthenticated(), controller.create_image);
router.post('/:id', auth.isAuthenticated(), controller.create);
router.post('/logo/:id', auth.isAuthenticated(), controller.logo);
router.post('/letterOfIncorporation/:id', auth.isAuthenticated(), controller.letterOfIncorporation);
router.post('/identificationCard/:id', auth.isAuthenticated(), controller.identificationCard);

// router.post('/base64/:id', auth.isAuthenticated(), controller.base64_create);
// router.post('/logo/base64/:id', auth.isAuthenticated(), controller.base64_logo);

router.get('/order/:id/:date/:order', auth.isAuthenticated(), controller.order);
router.get('/delete/:id/:date', auth.isAuthenticated(), controller.delete);

module.exports = router;
