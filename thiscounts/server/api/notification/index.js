'use strict';

let express = require('express');
let controller = require('./notification.controller');

let router = express.Router();
let auth = require('../../auth/auth.service');

router.get('/read/:id', auth.isAuthenticated(), controller.read);
router.get('/action/:id', auth.isAuthenticated(), controller.action);
router.get('/:entity_id/:skip/:limit', auth.isAuthenticated(), controller.find);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
