'use strict';

var express = require('express');
var controller = require('./test.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.get('/add/:user/:to_test', auth.isAuthenticated(), controller.add_user);
router.get('/add/:test/:to_test', auth.isAuthenticated(), controller.add_test);
router.post('/offer/:test', auth.isAuthenticated(), controller.offer);
router.post('/message/:test', auth.isAuthenticated(), controller.message);

module.exports = router;




