'use strict';

let express = require('express');
let controller = require('./location.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);


module.exports = router;
