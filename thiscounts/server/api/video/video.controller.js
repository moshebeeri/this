'use strict';

const _ = require('lodash');
const Video = require('./video.model.js');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('video');
const inspect = require('util').inspect;
const AWS = require('aws-sdk');
const Busboy = require('busboy');
const config = require('../../config/environment');
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
const async = require('async');
const randomstring = require('randomstring');

const distributionBaseURL = 'http://dhs9y2fxkp0xy.cloudfront.net/';

function findVideoObject(id, callback) {
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

/**
 * This module is based on the following gist
 * https://gist.github.com/schempy/87567e11633f8ef11c8e
 */
const s3Stream = require('s3-upload-stream')(new AWS.S3({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret
}));


function createFilename(origFilename) {
  return randomstring.generate({length: 10, charset: 'alphabetic'}) + '_' + origFilename
}

// Handle uploading file to Amazon S3.
// Uses the multipart file upload API.
function uploadS3(readStream, key) {
  const upload = s3Stream.upload({
    Bucket: 'thiscounts',
    ContentType: "binary/octet-stream",
    Key: 'videos/' + createFilename(key),
    ACL: 'public-read'
  });

  // Handle errors.
  upload.on('error', function (err) {
    console.log(err);
  });

  // Handle progress.
  upload.on('part', function (details) {
    console.log(inspect(details));
  });

  // Handle upload completion.
  upload.on('uploaded', function (details) {
    console.log(details);
  });

  // Pipe the Readable stream to the s3-upload-stream module.
  readStream.pipe(upload);
}


// https://github.com/mscdex/busboy
// https://github.com/nathanpeck/s3-upload-stream
exports.upload = function (req, res) {
  findVideoObject(req.params.id, function (err, object) {
    if (err) {
      return handleError(res, err);
    }
    if (!object) {
      return res.send(404);
    }

    // Create an Busyboy instance passing the HTTP Request headers.
    const busboy = new Busboy({headers: req.headers});
    // Listen for event when Busboy finds a file to stream.
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      const upload = s3Stream.upload({
        Bucket: 'thiscounts',
        ContentType: 'binary/octet-stream',
        Key: 'videos/' + createFilename(fieldname),
        ACL: 'public-read'
      });

      // Handle errors.
      upload.on('error', function (err) {
        return handleError(res, err);
      });

      // Handle progress.
      upload.on('part', function (details) {
        //console.log(inspect(details));
      });

      // Handle upload completion.
      upload.on('uploaded', function (details) {
        console.log(inspect(details));

        Video.create({
          creator: req.user.id,
          created: Date.now(),
          type: 'THIS',
          url: distributionBaseURL + details.Key
        }, function (err, video) {
          if (err) {
            return handleError(res, err);
          }
          object.video = video;
          object.save(function (err) {
              if (err) { return handleError(res, err); }
              res.status(200).json(video)
            });
        });
      });
      file.pipe(upload)
    });
    // Pipe the HTTP Request into Busboy.
    req.pipe(busboy);
  });

};

exports.youtube = function (req, res) {
  findVideoObject(req.params.id, function (err, object) {
    if (err) {
      return handleError(res, err);
    }
    if (!object) {
      return res.send(404);
    }
    Video.create({
      creator: req.user.id,
      created: Date.now(),
      type: 'YOUTUBE',
      url: req.params.youtube
    }, function (err, video) {
      if (err) {
        return handleError(res, err);
      }
      object.video = video;
      object.save(function (err) {
        if (err) { return handleError(res, err); }
        res.status(200).json(video)
      });
    });
  });
};

// Get list of videos
exports.index = function (req, res) {
  Video.find(function (err, videos) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(videos);
  });
};

// Get a single video
exports.show = function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (err) {
      return handleError(res, err);
    }
    if (!video) {
      return res.send(404);
    }
    return res.json(video);
  });
};

// Creates a new video in the DB.
exports.create = function (req, res) {
  Video.create(req.body, function (err, video) {
    if (err) {
      return handleError(res, err);
    }
    graphModel.reflect(video, function (err) {
      if (err) {
        return handleError(res, err);
      }
    });
    return res.json(201, video);
  });
};

// Updates an existing video in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Video.findById(req.params.id, function (err, video) {
    if (err) {
      return handleError(res, err);
    }
    if (!video) {
      return res.send(404);
    }
    let updated = _.merge(video, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(video);
    });
  });
};

// Deletes a video from the DB.
exports.destroy = function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (err) {
      return handleError(res, err);
    }
    if (!video) {
      return res.send(404);
    }
    video.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
