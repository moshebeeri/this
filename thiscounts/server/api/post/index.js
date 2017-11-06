'use strict';

let express = require('express');
let controller = require('./post.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.post('/publish/:id', auth.isAuthenticated(), controller.publish);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
