'use strict';

let express = require('express');
let controller = require('./phonebook.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

//router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.get('/:id', auth.isAuthenticated(), controller.showByUserId);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
