'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var Image = require('./image.model');
var aws = require('aws-sdk');
var config = require('../../config/environment');
var randomstring = require("randomstring");
var s3 = new aws.S3();
var folder = 'images';
var multiparty = require('multiparty');
//var gm = require('gm');
var fs = require('fs');
var Upload = require('s3-uploader');

var User = require('../user/user.model');
var Business = require('../business/business.model');
var ShoppingChain = require('../shoppingChain/shoppingChain.model');
var Product = require('../product/product.model');
var Group = require('../group/group.model');
var Promotion = require('../promotion/promotion.model');
var Mall = require('../mall/mall.model');
var Category = require('../category/category.model');
var CardType = require('../cardType/cardType.model');


var client = createClient();

function createClient() {
  return new Upload(config.aws.bucketName, {
    aws: {
      path: 'images/',
      region: 'us-east-1',
      acl: 'public-read',
      accessKeyId: config.aws.key,
      secretAccessKey: config.aws.secret
    },

    cleanup: {
      versions: true,
      original: true
    },

    original: {
      awsImageAcl: 'private'
    },

    versions: [{
      format: 'jpg',
      suffix: '-orig',
      quality: 90,
      awsImageExpires: 31536000,
      awsImageMaxAge: 31536000
    }, {
      maxWidth: 780,
      aspect: '3:2!h',
      suffix: '-medium'
    }, {
      maxWidth: 320,
      aspect: '16:9!h',
      suffix: '-small'
    }, {
      maxHeight: 250,
      maxWidth: 250,
      aspect: '1:1',
      suffix: '-thumb'
    }]
  });
}

exports.create = function (req, res) {
  return handle_image(req, res, 'image')
};

exports.logo = function (req, res) {
  return handle_image(req, res, 'logo')
};

function handle_image(req, res, type) {
  //var meta_data = req.headers.meta;
  var meta_data = {};
  var form = new multiparty.Form();
  var size = 0;
  var fileName = randomstring.generate({length: 8, charset: 'hex'});

  form.on('part', function (part) {
    console.log("====on part");
    part.filename = part.name;
    if (!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
  });
  form.on('file', function (name, file) {
    console.log("====on file");
    client.upload(file.path, {/*path: key*/}, function (err, versions, meta) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      console.log("====update versions");
      updateImageVersions(versions, req.params.id, meta_data, type, function (err, updated) {
        if (err) return handleError(res, err);
        return res.status(201).json(updated);
      });
    });

  });
  form.parse(req);
}
var fs = require("fs");
var base64 = require('file-base64');

exports.base64_create = function (req, res) {
  return base64_handle_image(req, res, 'image')
};

exports.base64_logo = function (req, res) {
  return base64_handle_image(req, res, 'logo')
};

function base64_handle_image(req, res, type) {
  //var meta_data = req.headers.meta;
  var meta_data = {};
  var form = new multiparty.Form();
  var size = 0;
  var fileName = randomstring.generate({length: 8, charset: 'hex'});

  form.on('part', function (part) {
    part.filename = part.name;
    if (!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
  });

  form.on('file', function (name, file) {
    fs.readFile(file.path, 'utf-8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var clear_img = data.replace(/^data:image\/*;base64,/, "");
      base64.decode(clear_img, file.path, function (err, output) {
        if (err) {
          console.log(err);
          return handleError(res, err);
        }
        client.upload(file.path, {/*path: key*/}, function (err, versions, meta) {
          if (err) {
            console.log(err);
            return handleError(res, err);
          }
          updateImageVersions(versions, req.params.id, meta_data, type, function (err, updated) {
            if (err) return handleError(res, err);
            return res.status(201).json(updated);
          });
        });
      });

    });
  });
  form.parse(req);
}


function updateImageVersions(version, id, meta_data, type, callback) {

  async.parallel({
      user: function (callback) {
        User.findById(id, callback);
      },
      business: function (callback) {
        Business.findById(id, callback);
      },
      shoppingChain: function (callback) {
        ShoppingChain.findById(id, callback);
      },
      product: function (callback) {
        Product.findById(id, callback);
      },
      group: function (callback) {
        Group.findById(id, callback);
      },
      promotion: function (callback) {
        Promotion.findById(id, callback);
      },
      mall: function (callback) {
        Mall.findById(id, callback);
      },
      category: function (callback) {
        Category.findById(id, callback);
      },
      cardType: function (callback) {
        CardType.findById(id, callback);
      }
    },
    function (err, results) {
      // results is now equals to: {one: 1, two: 2}
      if (err) {
        console.log(err)
      } else {

        var pictures = [];
        version.forEach(function (version) {
          pictures.push(version.url)
        });
        // we aim for one match only - hence return after first iteration
        for (var key in results) {
          var updated = results[key];
          if (updated) {
            if (type === 'logo')
              updated.logo = pictures[0];
            //type === 'image'
            else updated.pictures.push({
              pictures: pictures,
              meta: meta_data,
              date: Date.now(),
              order: 0
            });

            updated.save(function (err, updated) {
              if (err) {
                console.log(err);
                return callback(err, null);
              }
              return callback(null, updated);
            });
          }
        }
      }
    });
}

function find_object(id, callback) {
  async.parallel({
      user: function (callback) {
        User.findById(id, callback);
      },
      business: function (callback) {
        Business.findById(id, callback);
      },
      shoppingChain: function (callback) {
        ShoppingChain.findById(id, callback);
      },
      product: function (callback) {
        Product.findById(id, callback);
      },
      group: function (callback) {
        Group.findById(id, callback);
      },
      promotion: function (callback) {
        Promotion.findById(id, callback);
      },
      mall: function (callback) {
        Mall.findById(id, callback);
      },
      category: function (callback) {
        Category.findById(id, callback);
      },
      cardType: function (callback) {
        CardType.findById(id, callback);
      }
    },
    function (err, results) {
      if (err)
        return callback(err, null);

      for (var key in results) {
        var updated = results[key];
        if (updated) {
          return callback(null, updated);
        }
      }
    })
}

let s3del = new aws.S3(options = {
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret
});


function delete_picture_storage(picture){
  let objects = [];
  //url - formatted as https://s3.amazonaws.com/thiscounts/images/Af/FI/Cw-orig.jpeg
  let prefix_str = "https://s3.amazonaws.com/thiscounts/";
  picture.pictures.forEach((url)=>{
    let object = url.slice(prefix_str.length, str.length);
    objects.push(object);
  });

  let params = {
    Bucket: 'thiscounts',
    Delete: {
      Objects: objects,
    },
  };
  s3del.deleteObjects(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

//'/order/:id/:date/:order'
exports.order = function (req, res) {
  find_object(req.params.id, function (err, object) {
    if (err) return handleError(res, err);

    object.pictures.forEach(function (pic) {
      if (pic.date == req.params.date) {
        pic.order = req.params.order;
        object.save();
        return res.status(201).json(object);
      }
    });
    return res.status(400).json('could not find picture on tagged with date = ' + req.params.date);
  });
};

//'/delete/:id/:date'
exports.delete = function (req, res) {
  find_object(req.params.id, function (err, object) {
    if (err) return handleError(res, err);
    object.pictures = object.pictures.filter((pic) => pic.date != req.params.date);
    delete_picture_storage(object.pictures.filter((pic) => pic.date == req.params.date));
    object.save();
    return res.status(201).json(object);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
