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

// Get list of images
exports.index = function (req, res) {
  Image.find(function (err, images) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(images);
  });
};

// Get a single image
exports.show = function (req, res) {
  Image.findById(req.params.id, function (err, image) {
    if (err) {
      return handleError(res, err);
    }
    if (!image) {
      return res.status(404).send('Not Found');
    }
    return res.json(image);
  });
};

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
    part.filename = part.name;
    console.log(JSON.stringify(part));
    if (!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
  });
  form.on('file', function (name, file) {
    console.log("----------------------------------------------------------");
    console.log(JSON.stringify(file));
		var entityId = file.originalFilename.substring(file.originalFilename.lastIndexOf('--'),0).toString();
		console.log("entityId: " + entityId);

    console.log(name);
    console.log("----------------------------------------------------------");
    client.upload(file.path, {/*path: key*/}, function (err, versions, meta) {
      if (err) {
        console.log("ERROR-ERROR-ERROR-ERROR-ERROR-ERROR-ERROR-ERROR-ERROR-ERROR-");
        console.log(err);
        return handleError(res, err);
      }

      //versions.forEach(function (image) {
      // 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg
      //  console.log(image.width, image.height, image.url)
      //});
      console.log("------------- versions: " + versions);
      console.log("------------- req.params.rami: " + req.params.rami);
      console.log("------------- req.params.id: " + req.params.id);
      console.log(JSON.stringify(req.params));
      console.log(JSON.stringify(meta_data));
      console.log("------------- type: " + type);
      console.log("------------- req.user._id: " + req.user._id);
			if(entityId.length === 0){
				updateImageVersions(versions, req.user._id, meta_data, type);
			} else {
				updateImageVersions(versions, entityId, meta_data, type);
			}
			
      

      return res.status(201).json(versions);
    });

  });
  form.parse(req);
}



function updateImageVersions(version, id, meta_data, type) {

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

        for(var key in results) {
          var updated = results[key];
          if(updated){
            if(type === 'image')
              updated.pictures.push({
                pictures: pictures,
                meta : meta_data,
                id : randomstring.generate({length: 8, charset: 'hex'})
              });
            else if (type === 'logo')
            //[0] for original
              updated.logo = pictures[0];
            updated.save(function (err) {
              if (err) {
                console.log(err);
              }
            });
          }
        }
      }
    });
}

function find(collection, query, callback) {
  mongoose.connection.db.collection(collection, function (err, collection) {
    collection.find(query).toArray(callback);
  });
}

exports.works_create = function (req, res) {
  var multiparty = require('multiparty');
  var gm = require('gm');
  var fs = require('fs');
  var form = new multiparty.Form();
  var size = '';
  var fileName = randomstring.generate({length: 8, charset: 'hex'});
  form.on('part', function (part) {
    console.log("part:" + part.filename);
    if (!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
  });
  form.on('file', function (name, file) {
    console.log(file.path);
    var extension = /[^.]+$/.exec(file.originalFilename)[0];
    console.log('filename: ' + fileName);
    console.log('fileSize: ' + (size / 1024));
    var source_path = file.path;
    var target_path = '/home/moshe/uploads/fullsize/' + fileName + '.' + extension;
    var thumbPath = '/home/moshe/uploads/thumbs/' + fileName + '.png';
    fs.renameSync(source_path, target_path);
    gm(target_path)
      .resize(150, 150)
      .noProfile()
      .write(thumbPath, function (err) {
        if (err) console.error(err.stack);
      });
    return res.json(200, {
      full_size: fileName
    });
  });
  form.parse(req);
};


// Creates a new image in the DB.
//see http://stackoverflow.com/questions/30166907/uploading-images-with-mongoose-express-and-angularjs
//https://github.com/Turistforeningen/node-s3-uploader
exports.createX = function (req, res) {
  //switch(req.body.type){
  //  case 'USER'      :  {} break;
  //  case 'BUSINESS'  :  {} break; //BusinessSchema.findById()
  //  case 'SHOPPING_CHAIN'  :  {} break; //BusinessSchema.findById()
  //  case 'PRODUCT'   :  {} break;
  //  case 'PROMOTION' :  {} break;
  //  case 'MALL'      :  {} break;
  //  case 'CATEGORY'  :  {} break;
  //  case 'CARD_TYPE' :  {} break;
  //  default  :
  //      break;
  //}
  var key = folder + '/' + randomstring.generate({length: 8, charset: 'hex'}) + '_' + req.body.uploadName;


  var path = req.files.image.path;
  fs.readFile(path, function (err, file_buffer) {
    var params = {
      Bucket: config.aws.bucketName,
      Body: file_buffer,
      Key: key,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
    };

    s3.putObject(params, function (err, image) {
      if (err) {
        console.log(err);
        return handleError(res, err);
      }
      return res.status(201).json(params);
    });
  });

};


exports.create_upload_multipart = function (req, res) {
  //http://www.componentix.com/blog/9/file-uploads-using-nodejs-now-for-real
};

// Updates an existing image in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Image.findById(req.params.id, function (err, image) {
    if (err) {
      return handleError(res, err);
    }
    if (!image) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(image, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(image);
    });
  });
};

// Deletes a image from the DB.
exports.destroy = function (req, res) {
  Image.findById(req.params.id, function (err, image) {
    if (err) {
      return handleError(res, err);
    }
    if (!image) {
      return res.status(404).send('Not Found');
    }
    image.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function (req, file, callback) {
    //callback(null, file.fieldname + '-' + Date.now());
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage }).array('avatar');

exports.create2 = function (req, res) {

  upload(req,res,function(err) {
    console.log(req.body);
    console.log(req.headers);
    console.log(req.files);
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
};

