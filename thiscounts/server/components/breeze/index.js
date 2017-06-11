'use strict';

let express = require('express');
let controller = require('./breeze.controller');

let router = express.Router();

router.get('/metadata', controller.index);
router.post('/savechanges', controller.create);

module.exports = router;
