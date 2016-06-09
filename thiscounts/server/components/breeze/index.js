'use strict';

var express = require('express');
var controller = require('./breeze.controller');

var router = express.Router();

router.get('/metadata', controller.index);
router.post('/savechanges', controller.create);

module.exports = router;