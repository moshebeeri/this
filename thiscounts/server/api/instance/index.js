'use strict';

let express = require('express');
let controller = require('./instance.controller.js');

let router = express.Router();
let auth = require('../../auth/auth.service');

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/save/:id', auth.isAuthenticated(), controller.save);
router.get('/realize/:code', auth.isAuthenticated(), controller.realize);

module.exports = router;
