'use strict';

let express = require('express');
let controller = require('./ip.controller');

let router = express.Router();

router.get('/', controller.index);

module.exports = router;
