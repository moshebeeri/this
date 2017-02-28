'use strict';

var _ = require('lodash');
var Business = require('./business.model');
var logger = require('../../components/logger').createLogger();
var User = require('../user/user.model');
var Group = require('../group/group.controller');

var graphTools = require('../../components/graph-tools');
var graphModel = graphTools.createGraphModel('business');
var spatial = require('../../components/spatial').createSpatial();
var location = require('../../components/location').createLocation();
var utils = require('../../components/utils').createUtils();
var activity = require('../../components/activity').createActivity();

exports.address2 = function(req, res) {
  location.address( req.body.address, function(err, data){
    if(err) {return handleError("1",res, err);}
    //logger.info(data);
    if(data.results==0)
      return res.status(400).send('No location under this address : ' + req.body.address );

    if(data.results.length > 1)
      return res.status(400).send('Inconsistent address, google api find more then one location under this address : ' + req.body.address );

    logger.info("lat:" +data.results[0].geometry.location.lat);
    logger.info("lng:" +data.results[0].geometry.location.lng);
    return res.status(200).send();
  });
};

// Get list of businesses
exports.index = function(req, res) {
  Business.find(function (err, businesss) {
    if(err) { return handleError("2",res, err); }
    return res.status(200).json(businesss);
  });
};

// Get a single business
exports.show = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError("3",res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(business);
  });
};

exports.mine = function(req, res) {
  var userId = req.user._id;
  Business.find({'creator' : userId}, function (err, businesses) {
    if(err) { return handleError("4",res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    return res.json(businesses);
  });
};

function defined(obj){
  return utils.defined(obj);
}

exports.create = function(req, res) {
  var creator = null;
  var body_business = req.body;
  var userId = req.user._id;
  User.findById(userId, '-salt -hashedPassword -sms_code', function (err, user) {
    if (err) return res.status(401).send(err.message);
    if (!user) return res.status(401).send('Unauthorized');
    creator = user;
  });
  body_business.creator = userId;

  /**************** RAMI *****************
  body_business.locations = [] ;
  body_business.locations[0] = [] ;
  body_business.locations[0]["lat"] = 40.8588700;
  body_business.locations[0]["lng"] = -73.8911250;
  console.log(body_business.locations);
  ***************************************/

  location.address_location( body_business, function(err, data) {
    if (err) {
      if (err.code >= 400) return res.status(err.code).send(err.message);
      else if (err.code == 202){
        console.log(err);
        return res.status(202).json(data);
      }
    }
    console.log("**********************************");
    console.log("data: " + JSON.stringify(data));
    console.log("**********************************");
    body_business.location = spatial.geo_to_location(data);

    //console.log(body_business.location);
    Business.create(body_business, function(err, business) {
      if(err) { return handleError("5",res, err); }
      graphModel.reflect(business, {
        _id: business._id,
        name: business.name,
        creator: business.creator,
        lat: body_business.location.lat,
        lon: body_business.location.lng
      }, function (err, business ) {
        if (err) {  return handleError("6",res, err); }

        console.log("**********************************");
        console.log("creator.gid: " + creator.gid);
        console.log("business.gid: " + business.gid);
        console.log("**********************************");

        graphModel.db().relate(creator.gid, 'OWNS', business.gid, {}, function(err, relationship) {
          if(err) {console.log(err.message);}
          logger.info('(' + relationship.start + ')-[' + relationship.type + ']->(' + relationship.end + ')');

          if(defined(business.shopping_chain))
            graphModel.relate_ids(business._id, 'BRANCH_OF', business.shopping_chain);

          if(defined(business.mall))
            graphModel.relate_ids(business._id, 'IN_MALL', business.mall);

          spatial.add2index(business.gid, function(err, result){
            if(err) logger.error(err.message);
            else logger.info('object added to layer ' + result)
          });
        });
        activity.activity({
          business  : business._id,
          actor_user: business.creator,
          action : "created"
        }, function (err) {if(err) logger.error(err.message)});
      });
      console.log("================================================");
      console.log("GO CREATE GROUP");
      console.log("================================================");

      req.body["creator_type"] = 'BUSINESS';
      req.body["add_policy"] = 'REQUEST';
      req.body["business_id"] = business._id;
      console.log("================================================");
      console.log(req.body);
      console.log(req.body["creator_type"]);
      console.log(req.body["add_policy"]);
      console.log(req.body["business_id"]);
      console.log("================================================");

      Group.create(req, res);
      //return res.status(201).json(business);
    });
  });
};

/* {
*   promotion : promotion ,
*   user      : user      ,
*   business  : business  ,
*   mall      : mall      ,
*   chain     : chain     ,
*
*   actor_user      : user      ,
*   actor_business  : business  ,
*   actor_mall      : mall      ,
*   actor_chain     : chain     ,
*
*   action    : action
 * } */



// Updates an existing business in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Business.findById(req.params.id, function (err, business) {
    if (err) { return handleError("7",res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    var updated = _.merge(business, req.body);
    updated.save(function (err) {
      if (err) { return handleError("8",res, err); }
      return res.status(200).json(business);
    });
  });
};

// Deletes a business from the DB.
exports.destroy = function(req, res) {
  Business.findById(req.params.id, function (err, business) {
    if(err) { return handleError("9",res, err); }
    if(!business) { return res.status(404).send('Not Found'); }
    business.remove(function(err) {
      if(err) { return handleError("10",res, err); }
      return res.status(204).send('No Content');
    });
  });
};

//router.post('/add/users/:to_group', auth.isAuthenticated(), controller.add_users);
// user[phone_number] and user[sms_verified]
exports.add_users = function(req, res) {
  console.log("=================== ADD USERS TO BUSINESS ===================");
  Business.findById(req.params.to_group, function (err, group) {
    if(err) { return handleError("11",res, err); }
    if(!group) { return res.status(404).send('no group'); }

    if(utils.defined(_.find(group.admins, req.user._id) && (group.add_policy == 'OPEN' || group.add_policy == 'CLOSE'))){
      console.log("=================== USERS FOLLOW BUSINESS ===================");
      console.log(req.body.users);
      for(var user in req.body.users) {
        console.log(req.body.users[user]);
        console.log("==============================: " + Object.keys(req.body.users)[Object.keys(req.body.users).length-1]);
        console.log("==============================: " + user);
        if(user != Object.keys(req.body.users)[Object.keys(req.body.users).length-1]){
          user_follow_group(req.body.users[user], group, false, res);
        } else {
          user_follow_group(req.body.users[user], group, true, res);
        }
      }
    }
    else if(group.add_policy == 'REQUEST' || group.add_policy == 'ADMIN_INVITE' || group.add_policy == 'MEMBER_INVITE' )
      return handleError("12",res, 'add policy ' + group.add_policy + ' not implemented');
    else
      return res.status(404).send('Can not add users');
  });
};

function user_follow_group(user_id, group, isReturn, res){
  graphModel.relate_ids(user_id, 'FOLLOW', group._id);
  user_follow_group_activity(group, user_id);
  if(isReturn){
    return res.json(200, group);
  }
}

function user_follow_group_activity(group, user) {
  user_activity({
    group: group,
    action: "business_follow",
    actor_user: user
  });
}

function user_activity(act){
  activity.activity(act, function (err) {
    if (err) logger.error(err.message)
  });

}

exports.following_user = function (req, res) {
  console.log("user_following_groups");
  console.log("user: " + req.user._id);
  var userId = req.user._id;
  console.log("MATCH (u:user {_id:'"+ userId +"'})-[r:OWNS]->(b:business) RETURN b LIMIT 25");
  graphModel.query("MATCH (u:user {_id:'"+ userId +"'})-[r:OWNS]->(b:business) RETURN b LIMIT 25", function(err, groups){
    if (err) {return handleError("13",res, err)}
    if(!groups) { return res.send(404); }
    console.log(JSON.stringify(groups));
    return res.status(200).json(groups);
  });
};


function handleError(msg,res, err) {
  console.log(" --------------- " + msg + " --------------- ");
  console.log(err);
  return res.status(500).send(err);
}

