'use strict';

var _ = require('lodash');
var Image = require('./image.model');
var aws = require('aws-sdk');
var config = require('../../config/environment');
var randomstring = require("randomstring");
var s3 = new aws.S3();
var folder = 'images'

var Upload = require('s3-uploader');
var client = createClient();

//var BusinessSchema = require('mongoose').model('Business').schema
var Business = require('../business')

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
      maxHeight: 1040,
      maxWidth: 1040,
      format: 'jpg',
      suffix: '-large',
      quality: 80,
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
      maxHeight: 100,
      aspect: '1:1',
      format: 'png',
      suffix: '-thumb1'
    }, {
      maxHeight: 250,
      maxWidth: 250,
      aspect: '1:1',
      suffix: '-thumb2'
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

// Creates a new image in the DB.
//see http://stackoverflow.com/questions/30166907/uploading-images-with-mongoose-express-and-angularjs
//https://github.com/Turistforeningen/node-s3-uploader
exports.create = function (req, res) {
  switch(req.body.type){
    case 'USER'      :  {} break;
    case 'BUSINESS'  :  {BusinessSchema.findById()} break;
    case 'PRODUCT'   :  {} break;
    case 'PROMOTION' :  {} break;
    case 'MALL'      :  {} break;
    case 'CATEGORY'  :  {} break;
    case 'CARD_TYPE' :  {} break;
    default  :
        break;

  }
  var key = folder + '/' + randomstring.generate({length:8,charset:'hex'}) + '_' + req.body.uploadName;
  client.upload(req.files.image.path, { /*path: key*/ }, function (err, versions, meta) {
    if (err) {
      console.log(err);
      return handleError(res, err);
    }

    versions.forEach(function (image) {
      console.log(image.width, image.height, image.url);
      // 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg
    });
    return res.status(201).json(versions);
  });


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

