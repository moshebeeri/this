'use strict';

var express = require('express');
var controller = require('./profile.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
//router.get('/:id', auth.isAuthenticated(), controller.show);
//router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', auth.isAuthenticated(), controller.update);
//router.patch('/:id', auth.isAuthenticated(), controller.update);
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.get('/me', auth.isAuthenticated(), controller.me);

router.get('/promotions/realized/:_id/:scroll', auth.isAuthenticated(), controller.realized_promotions );
router.get('/promotions/shared/:_id/:scroll'  , auth.isAuthenticated(), controller.shared_promotions   );
router.get('/promotions/saved/:_id/:scroll'   , auth.isAuthenticated(), controller.saved_promotions    );

router.get('/malls/liked/:_id/:scroll'        , auth.isAuthenticated(), controller.liked_malls         );
router.get('/malls/promotions/:_id/:scroll'   , auth.isAuthenticated(), controller.promotions_malls    );
router.get('/malls/realized/:_id/:scroll'     , auth.isAuthenticated(), controller.realized_malls      );

router.get('/cards/member/:_id/:scroll'       , auth.isAuthenticated(), controller.member_cards        );
router.get('/cards/promotions/:_id/:scroll'   , auth.isAuthenticated(), controller.promotions_cards    );
router.get('/cards/realized/:_id/:scroll'     , auth.isAuthenticated(), controller.realized_cards      );

router.get('/follow/followers/:_id/:scroll'   , auth.isAuthenticated(), controller.followers           );
router.get('/follow/following/:_id/:scroll'   , auth.isAuthenticated(), controller.following           );


module.exports = router;
