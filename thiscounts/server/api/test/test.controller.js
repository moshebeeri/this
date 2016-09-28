'use strict';

var _ = require('lodash');
var Test = require('./test.model');
var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('test');
var activity = require('../../components/activity').createActivity();
var logger = require('../../components/logger').createLogger();
var utils = require('../../components/utils').createUtils();

// Get list of tests
exports.index = function(req, res) {
  Test.find(function (err, tests) {
    if(err) { return handleError(res, err); }
    return res.json(200, tests);
  });
};

// Get a single test
exports.show = function(req, res) {
  Test.findById(req.params.id, function (err, test) {
    if(err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    return res.json(test);
  });
};

function to_graph(test) {
  return {
    _id: test._id,
    name: test.name,
    created: test.created
  }
}

function test_activity(test, action) {
  var act = {
    test: test._id,
    action: action
  };
  if (test.creator_type == 'USER')
    act.actor_user = test.creator;
  else if (test.creator_type == 'CHAIN')
    act.actor_chain = test.creator;
  else if (test.creator_type == 'BUSINESS')
    act.actor_business = test.creator;
  else if (test.creator_type == 'MALL')
    act.actor_mall = test.creator;
  user_activity(act);
}

function user_follow_test_activity(test, user) {
  user_activity({
    test: test,
    action: "test_follow",
    actor_user: user
  });
}

function user_activity(act){
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });

}

function test_offer_activity(test, offer){
  activity.test_activity({
    offer: offer,
    action: "test_offer",
    actor_test: test
  }, function (err) {
    if (err) logger.error(err.message)
  });
}

function test_message_activity(){

}

function test_follow_test_activity(following, followed) {
  user_activity({
    test: followed,
    action: "test_follow",
    actor_test: following
  });
}

// Creates a new test in the DB.
exports.create = function(req, res) {
  Test.create(req.body, function(err, test) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(test, to_graph(test), function (err) {
      if (err) {  return handleError(res, err); }
      graphModel.relate_ids(test._id, 'CREATED_BY', req.body._id);
      test_activity(test, "create");
    });
    return res.json(201, test);
  });
};

// Updates an existing test in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Test.findById(req.params.id, function (err, test) {
    if (err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    var updated = _.merge(test, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, test);
    });
  });
};

// Deletes a test from the DB.
exports.destroy = function(req, res) {
  Test.findById(req.params.id, function (err, test) {
    if(err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    test.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// offer to test.
//router.post('/offer/:test', auth.isAuthenticated(), controller.offer);
exports.offer = function(req, res) {
  var offer = req.body;
  Test.findById(req.params.test, function (err, test) {
    if (err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    graphModel.relate_ids(test._id, 'OFFER', offer._id);
    test_offer_activity(test, offer);
    return res.json(200, test);
  });
};

//router.post('/message/:test', auth.isAuthenticated(), controller.message);
exports.message = function(req, res) {
  Test.findById(req.params.test, function (err, test) {
    if (err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    //var updated = _.merge(test, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      graphModel.relate_ids(test._id, 'CREATED_BY', req.body._id);
      test_message_activity(test);
      return res.json(200, test);
    });
  });
};

function user_follow_test(user_id, test, res){
  graphModel.relate_ids(user_id, 'FOLLOW', test._id);
  user_follow_test_activity(test, user_id);
  return res.json(200, test);
}

function test_follow_test(following_test_id, test_to_follow_id, res){
  graphModel.relate_ids(following_test_id, 'FOLLOW', test_to_follow_id);
  test_follow_test_activity(test, user_id);
  return res.json(200, test);
}

function add_user_to_test_admin(user_id, test, res){
   graphModel.relate_ids(user_id, 'TEST_ADMIN', test._id);
  test.admins.push(user_id);
  Test.save(function (err) {
    if (err) { return handleError(res, err); }
    return res.json(200, test);
  });
}

exports.add_admin = function(req, res) {
  Test.findById(req.params.to_test, function (err, test) {
    if(err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    //if requester is test admin he may add admins
    if(utils.defined(_.find(test.admins, req.user._id))) {
      user_follow_test(req.user._id, test, function(err, test){
        add_user_to_test_admin(req.user._id, test)
      });
    }
  });
};

//router.get('/add/:user/:to_test', auth.isAuthenticated(), controller.add_user);
// add_policy: {
//   type: String,
//     required : true,
// enum: [
//     'OPEN',         //  any one can add himself
//     'CLOSE',        //  only admin adds
//     'REQUEST',      //  anyone can request to be added
//     'ADMIN_INVITE', //  admin invite
//     'MEMBER_INVITE' //  member invite
//   ]
// },
exports.add_user = function(req, res) {
    Test.findById(req.params.to_test, function (err, test) {
      if(err) { return handleError(res, err); }
      if(!test) { return res.send(404); }

      if(test.add_policy == 'OPEN'){
        if(req.user._id ==  req.params.user )
          return user_follow_test(req.user._id, test, res);
        else
          return res.send(404, 'Test add policy OPEN - authenticated user may only add himself');
      }
      if(test.add_policy == 'CLOSE'){
        if(utils.defined(_.find(test.admins, req.user._id)))
          return user_follow_test(req.user._id, test, res);
        else
          return res.send(404, 'Test add policy CLOSE - only admin may add users');
      }
      if(test.add_policy == 'REQUEST' ||
        test.add_policy == 'ADMIN_INVITE' ||
        test.add_policy == 'MEMBER_INVITE' )
        return handleError(res, 'add policy ' + test.add_policy + ' not implemented');
  });
};

//router.get('/add/:test/:to_test', auth.isAuthenticated(), controller.add_test);
exports.add_test = function(req, res) {
  Test.findById(req.params.id, function (err, test) {
    if(err) { return handleError(res, err); }
    if(!test) { return res.send(404); }
    //user mast be one of the admins
    if(utils.defined(_.find(test.admins, req.user._id)))
      return test_follow_test(req.user._id, test, res);
    else
      return res.send(404, 'Only test admin may follow other tests');
  });
};


function handleError(res, err) {
  return res.send(500, err);
}
