'use strict';

var express = require('express');
var controller = require('./image.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/:id', auth.isAuthenticated(), controller.create);
router.post('/un_auth/:id', controller.create);
router.post('/logo/:id', auth.isAuthenticated(), controller.logo);
//router.put('/', auth.isAuthenticated(), controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;




//var express = require('express')
//  , router = express.Router()
//  , aws = require('aws-sdk');
//
//var controller = require('./image.controller');
//
//var uploading = multer({
//  dest: __dirname + '../public/uploads/',
//  limits: {fileSize: 1000000, files:1},
//});
