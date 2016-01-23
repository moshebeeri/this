'use strict';
var graphTools = require('../components/graph-tools');
var Promotion = require('../api/promotion/promotion.model');


initNeo4j();

function initNeo4j() {
  var PromotionType = graphTools.createGraphModel('PromotionType');
  PromotionType.model.setUniqueKey('PromotionType', true);
  var typEnum = Promotion.schema.path('type').enumValues;
  typEnum.forEach(function(typeStr){
    PromotionType.save({PromotionType: typeStr}, function(err, obj){
      if(err) console.log("failed " + err.message);
      else console.log("PromotionType " + JSON.stringify(obj) + " created");
    });
  });
  var SocialType = graphTools.createGraphModel('SocialType');
  SocialType.model.setUniqueKey('SocialType', true);
  var socialEnum = Promotion.schema.path('social').enumValues;
  socialEnum.forEach(function(typeStr){
    SocialType.save({SocialType: typeStr}, function(err, obj){
      if(err) console.log("failed " + err.message);
      else console.log("SocialType " + JSON.stringify(obj) + " created");
    });
  });
}
