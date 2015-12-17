'use strict';

var _ = require('lodash');
var db = require('seraph')({  server: "http://localhost:7474",
                              user: "neo4j",
                              pass: "saywhat" });
var model = require('seraph-model');
//var PromotionGraph = model(db, 'promotion');

var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()//,
        //new (winston.transports.File)({ filename: 'somefile.logger' })
    ]
});

function GraphModel(class_name) {
  //this.class_name = class_name;
  this.model = model(db, class_name);
  //this.connect();
}

GraphModel.prototype.connect = function connect(){
  logger.info("--> Connect to GraphModel <--");
};

GraphModel.prototype.saySomething = function saySomething(to, from, message) {
  logger.info("to:" + to + " from:" + from + " message:" + message)
  return "something";
}

GraphModel.prototype.reflect = function reflect(object, callback) {
  model = this.model;
  model.save(JSON.stringify(object), function(err, g_object) {
      if(err) callback(err, g_object );
      object.gid = g_object.id;
      object.save(function (err) {});
  });
}



module.exports = GraphModel;


// logger.info("g_object:" (JSON.stringify(g_object))
// object.gid = g_object.id;
// logger.info(this.class_name +": object.gid=" + object.gid);
// object.save(function (err) {
//   if (err) callback(err, object);
//   callback(null, object);


// Creates a new promotion in the DB.
// exports.create = function(req, res) {
//   Promotion.create(req.body, function(err, promotion) {
//     logger.info("Promotion.created : " + promotion._id);
//     if(err) { return handleError(res, err); }
//     logger.info("JSON.stringify=" + JSON.stringify(promotion, ["creator","name", "_id"]));
//     PromotionGraph.save(JSON.stringify(promotion), function(err, gpromotion) {
//         if(err) { return res.end(err.message); } //handleError(res, err); }
//         promotion.gid = gpromotion.id;
//         logger.info("promotion.gid=" + promotion.gid);
//         promotion.save(function (err) {
//           if (err) { return handleError(res, err); }
//           return res.json(200, promotion);
//       });
//     });
//   });
// };
