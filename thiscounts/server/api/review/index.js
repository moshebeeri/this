'use strict';

let express = require('express');
let controller = require('./review.controller');

let router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('element_reviews/:id', controller.element_reviews);

module.exports = router;
