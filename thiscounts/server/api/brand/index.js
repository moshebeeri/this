'use strict';

let express = require('express');
let controller = require('./brand.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/search/:skip/:limit/:searchString', auth.isAuthenticated(), controller.search);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
