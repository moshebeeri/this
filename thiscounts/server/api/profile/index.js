'use strict';

let express = require('express');
let controller = require('./profile.controller');
let auth = require('../../auth/auth.service');

let router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
//router.get('/:id', auth.isAuthenticated(), controller.show);
//router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', auth.isAuthenticated(), controller.update);
//router.patch('/:id', auth.isAuthenticated(), controller.update);
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);

router.get('/test_me', controller.test_me);

router.get('/me', auth.isAuthenticated(), controller.me);

router.get('/instances/realized/:skip/:limit', auth.isAuthenticated(), controller.realized_instances );
router.get('/instances/saved/:skip/:limit'   , auth.isAuthenticated(), controller.saved_instances    );
router.get('/instances/shared/:skip/:limit'  , auth.isAuthenticated(), controller.shared_instances   );

router.get('/malls/liked/:skip/:limit'        , auth.isAuthenticated(), controller.liked_malls         );
router.get('/malls/promotions/:skip/:limit'   , auth.isAuthenticated(), controller.promotions_malls    );
router.get('/malls/realized/:skip/:limit'     , auth.isAuthenticated(), controller.realized_malls      );

router.get('/cards/member/:skip/:limit'       , auth.isAuthenticated(), controller.member_cards        );
router.get('/cards/promotions/:skip/:limit'   , auth.isAuthenticated(), controller.promotions_cards    );
router.get('/cards/realized/:skip/:limit'     , auth.isAuthenticated(), controller.realized_cards      );

router.get('/follow/followers/:skip/:limit'   , auth.isAuthenticated(), controller.followers           );
router.get('/follow/following/:skip/:limit'   , auth.isAuthenticated(), controller.following           );


module.exports = router;
