'use strict';

let _ = require('lodash');
let async = require('async');

let util = require('util');
let utils = require('../../components/utils').createUtils();

let Profile = require('./profile.model');
let User = require('../user/user.model');
let Card = require('../card/card.model');
let Business = require('../business/business.model');
let Instance = require('../instance/instance.model');
let graphTools = require('../../components/graph-tools');
let graphModel = graphTools.createGraphModel('promotion');


// Get a single profile
exports.me = function (req, res) {

  function add_user(callback) {
    User.findOne({
      _id: req.user._id
    }, '-salt -hashedPassword -sms_code', callback);
  }

  function add_business(callback) {
    Business.find({creator: req.user._id}).limit(10).sort({created: -1}).select({name: 1, _id: 1}).exec(callback);
  }

  function add_saved(callback) {
    instances_by_relation_async('SAVED', req.user._id, {
      skip: 0,
      limit: 50
    },callback)
  }

  async.parallel({
      user: function (callback) {
        add_user(callback)
      },
      businesses: function (callback) {
        add_business(callback)
      },
      saved: function (callback) {
        add_saved(callback)
      }
    },
    function (err, profile) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(profile);
    });
};

// Get list of profiles
exports.index = function (req, res) {
  Profile.find(function (err, profiles) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(profiles);
  });
};

// Get a single profile
exports.show = function (req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    if (!profile) {
      return res.status(404).send('Not Found');
    }
    return res.json(profile);
  });
};

// Creates a new profile in the DB.
exports.create = function (req, res) {
  Profile.create(req.body, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(profile);
  });
};

// Updates an existing profile in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Profile.findById(req.params.id, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    if (!profile) {
      return res.status(404).send('Not Found');
    }
    let updated = _.merge(profile, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(profile);
    });
  });
};

// Deletes a profile from the DB.
exports.destroy = function (req, res) {
  Profile.findById(req.params.id, function (err, profile) {
    if (err) {
      return handleError(res, err);
    }
    if (!profile) {
      return res.status(404).send('Not Found');
    }
    profile.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function instances_by_relation_async(rel, user_id, paginate, callback) {
  let query = `MATCH (u:user{_id:'${user_id}' })-[rel:${rel}]->(instance:instance) return rel,instance ORDER BY rel.timestamp DESC
                    skip ${paginate.skip} limit ${paginate.limit}`;
  graphModel.query(query, function (err, g_instances) {
    if (err) {
      return callback(err)
    }
    let _ids_map = g_instances.reduce(function (map, obj) {
      map[obj.instance._id] = obj;
      return map;
    }, {});

    Instance.find({}).where('_id')
      .in(Object.keys(_ids_map))
      .populate('promotion')
      .populate({path: 'promotion.entity.business', model: 'Instance'})
      .exec(function (err, instances) {
      if (err) {
        callback(err)
      }
      let ret = instances.map(function (instance) {
        return {instance: instance, graph: _ids_map[instance._id]}
      });
      console.log(JSON.stringify(ret));
      return callback(null, ret);
    });
  });
}

function instances_by_relation(rel, req, res) {
  instances_by_relation_async(rel, req.user._id, utils.to_paginate(req), function (err, ret) {
    if (err) { return handleError(res, err) }
    return res.status(200).json(ret);

  });
  // let query = `MATCH (u:user{_id:'${req.user._id}' })-[rel:${rel}]->(instance:instance) return rel,instance ORDER BY rel.timestamp DESC
  //                   skip ${paginate.skip} limit ${paginate.limit}`;
  // graphModel.query(query, function (err, g_instances) {
  //   if (err) {
  //     return handleError(res, err)
  //   }
  //   //let _ids = g_instances.map(instance => instance.i._id);
  //   let _ids_map = g_instances.reduce(function (map, obj) {
  //     map[obj.instance._id] = obj;
  //     return map;
  //   }, {});
  //
  //   Instance.find({}).where('_id').in(Object.keys(_ids_map)).populate('promotion').exec(function (err, instances) {
  //     if (err) {
  //       callback(err, null)
  //     }
  //     let ret = instances.map(function (instance) {
  //       return {instance: instance, graph: _ids_map[instance._id]}
  //     });
  //     return res.status(200).json(ret);
  //   });
  // });
}

exports.saved_instances = function (req, res) {
  instances_by_relation('SAVED', req, res);
};

exports.realized_instances = function (req, res) {
  instances_by_relation('REALIZED', req, res);
};

exports.shared_instances = function (req, res) {
  instances_by_relation('SHARED', req, res);
};

exports.liked_malls = function (req, res) {
  let paginate = utils.to_paginate(req);
  graphModel.related_type_id_dir(req.user._id, 'LIKE', 'mall', 'out', paginate.skip, paginate.limit, function (err, followers) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(followers);
  });
};

exports.promotions_malls = function (req, res) {
  let paginate = utils.to_paginate(req);
  let query = util.format("MATCH (user { _id:'{%s}'})-[]->(:instance)-[]->(p:promotion)-[r:MALL_PROMOTION]->(m:mall)' return p._id ad _id skip %s limit %s", req.user._id, paginate.skip, paginate.limit);
  graphModel.query(query, function (err, malls) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(malls);
  });
};

exports.test_me = function (req, res) {
  // let distributor = require('../../components/distributor');
  // let spreads = distributor.distributePromotions(20, 40, 5, 30);
  // return res.status(201).json(spreads);
  let a =[{_id: '5935a88d16972d5037c79991'},
      {_id: '5935a88d16972d5037c79992'}];
  const ret = a.reduce(function (acc, obj) {
    acc.push(obj._id)
  }, []);
  return res.status(201).json(ret);
};

exports.realized_malls = function (req, res) {
  return res.status(204).send('No Content');
};

exports.member_cards = function (req, res) {
  let paginate = utils.to_paginate(req);
  let query = graphModel.paginate_query(
    `MATCH (s { _id:'${req.user._id}' })-[r:CARD_MEMBER]->(ret:card) return ret._id as _id`,
    paginate.skip, paginate.limit);
  graphModel.query_objects_general(Card, query,
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    })
};

exports.promotions_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.realized_cards = function (req, res) {
  return res.status(204).send('No Content');
};

exports.followers = function (req, res) {
  let paginate = utils.to_paginate(req);

  graphModel.query_objects_general(User,
    graphModel.followers_query(req.user._id, paginate.skip, paginate.limit),
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    });
};

exports.following = function (req, res) {
  let paginate = utils.to_paginate(req);

  graphModel.query_objects_general(User,
    graphModel.following_query(req.user._id, paginate.skip, paginate.limit),
    function (err, objects) {
      if (err) return handleError(res, err);
      return res.status(200).json(objects);
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
