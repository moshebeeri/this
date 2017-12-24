'use strict';

let express = require('express');
let controller = require('./pricing.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/', auth.hasRole('admin'), controller.index);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
