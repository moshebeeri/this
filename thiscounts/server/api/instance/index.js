'use strict';

var express = require('express');
var controller = require('./instance.controller.js');

var router = express.Router();
let auth = require('../../auth/auth.service');

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/save/:id', auth.isAuthenticated(), controller.save);
router.get('/realize/:id/:realize_code', auth.isAuthenticated(), controller.realize);
router.get('/realize/:id/:realize_code/:sale_point_code', auth.isAuthenticated(), controller.realize);

module.exports = router;
