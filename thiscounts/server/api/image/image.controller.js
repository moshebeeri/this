'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const async = require('async');
const Image = require('./image.model');
const aws = require('aws-sdk');
const config = require('../../config/environment');
const randomstring = require("randomstring");
const s3 = new aws.S3();
const multiparty = require('multiparty');

const fs = require('fs');
const Upload = require('s3-uploader');

const User = require('../user/user.model');
const Business = require('../business/business.model');
const ShoppingChain = require('../shoppingChain/shoppingChain.model');
const Product = require('../product/product.model');
const Group = require('../group/group.model');
const Promotion = require('../promotion/promotion.model');
const Mall = require('../mall/mall.model');
const Post = require('../post/post.model');
const Category = require('../category/category.model');
const CardType = require('../cardType/cardType.model');
const base64 = require('file-base64');
const vision = require('@google-cloud/vision');

const visionClient = vision({
  projectId: 'this-f2f45',
  keyFilename: './server/config/keys/this-vision.json'
});

const client = createClient();

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
      awsImageAcl: 'private',
      awsImageExpires: 31536000,
      awsImageMaxAge: 31536000
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
  return handle_image(req, res, 'image');
};

exports.logo = function (req, res) {
  return handle_image(req, res, 'logo');
};

function checkSafeSearch(annotation, callback) {
  function violates(category){
    return category === 'Possible' || category === 'Likely' || category === 'Very Likely'
  }
  if(annotation) {
    if (violates(annotation.adult)) return callback(new Error(`${annotation.adult} to be adult image`));
    if (violates(annotation.spoof)) return callback(new Error(`${annotation.spoof} to be spoof image`));
    if (violates(annotation.violence)) return callback(new Error(`${annotation.adult} to be violence image`));
    if (violates(annotation.medical)) return callback(new Error(`${annotation.medical} to be medical image`));
  }else{
    console.error('checkSafeSearch annotation is null');
  }
  return callback(null);
}

function handle_image(req, res, type) {
  //let meta_data = req.headers.meta;
  let meta_data = {};
  let form = new multiparty.Form();
  let size = 0;
  let fileName = randomstring.generate({length: 8, charset: 'hex'});

  form.on('part', function (part) {
    part.filename = part.name;
    if (!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
  });
  form.on('file', function (name, file) {
    client.upload(file.path, {/*path: key*/}, function (err, versions, meta) {
      if (err) {return handleError(res, err);}
      visionClient.safeSearchDetection({source: {imageUri: versions[1].url}}).then(response => {
        if (err) {return handleError(res, err);}
        checkSafeSearch(response[0].safeSearchAnnotation, function (err) {
          if (err) {return res.status(400).send(err.message);}
          updateImageVersions(versions, req.params.id, meta_data, type, function (err, updated) {
            if (err) return handleError(res, err);
            return res.status(201).json(updated);
          });
        });
      }).catch(err => {
        console.error(err);
      });
    });

  });
  form.parse(req);
}

exports.base64_create = function (req, res) {
  return base64_handle_image(req, res, 'image')
};

exports.base64_logo = function (req, res) {
  return base64_handle_image(req, res, 'logo')
};

function base64_handle_image(req, res, type) {
  //let meta_data = req.headers.meta;
  let meta_data = {};
  let form = new multiparty.Form();
  let size = 0;
  let fileName = randomstring.generate({length: 8, charset: 'hex'});

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
      let clear_img = data.replace(/^data:image\/*;base64,/, "");
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


function updateImageVersions(versions, id, meta_data, type, callback) {
  function saveCallback(err, updated) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, updated);
  }
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
      post: function (callback) {
        Post.findById(id, callback);
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
        return console.log(err);
      } else {
        let pictures = [];
        versions.forEach(function (version) {
          pictures.push(version.url);
        });
        // we aim for one match only - hence return after first iteration
        for (let key in results) {
          let updated = results[key];
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
            updated.save(saveCallback);
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
      post: function (callback) {
        Post.findById(id, callback);
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

      for (let key in results) {
        let updated = results[key];
        if (updated) {
          return callback(null, updated);
        }
      }
      return callback(null, null);
    })
}

let s3del = new aws.S3({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret
});


function delete_picture_storage(picture){
  let objects = [];
  //url - formatted as https://s3.amazonaws.com/thiscounts/images/Af/FI/Cw-orig.jpeg
  let prefix_str = "https://s3.amazonaws.com/thiscounts/";
  picture.pictures.forEach((url)=>{
    let object = url.slice(prefix_str.length, prefix_str.length);
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
    if(!object) return res.status(404);

    object.pictures.forEach(function (pic) {
      if (pic.date === req.params.date) {
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
    if(!object) return res.status(404);

    object.pictures = object.pictures.filter((pic) => pic.date !== req.params.date);
    delete_picture_storage(object.pictures.filter((pic) => pic.date === req.params.date));
    object.save();
    return res.status(201).json(object);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
