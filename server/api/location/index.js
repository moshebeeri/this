'use strict';

var express = require('express');
var controller = require('./location.controller');

var router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/:id', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

router.post('/', controller.test);


module.exports = router;
