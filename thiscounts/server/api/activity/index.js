'use strict';

let express = require('express');
let controller = require('./activity.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.isAuthenticated(), auth.hasRole('admin'), controller.destroy);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.get('/share/:activity/:user', auth.isAuthenticated(), controller.share);

module.exports = router;
