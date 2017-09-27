'use strict';

const _ = require('lodash');
const Video = require('./video.model.js');
const graphTools = require('../../components/graph-tools');
const graphModel = graphTools.createGraphModel('video');
const inspect = require('util').inspect;
const AWS = require('aws-sdk');
const Busboy = require('busboy');
const config = require('../../config/environment');

/**
 * This module is based on the following gist
 * https://gist.github.com/schempy/87567e11633f8ef11c8e
 */
const s3Stream = require('s3-upload-stream')(new AWS.S3({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret
}));

// Handle uploading file to Amazon S3.
// Uses the multipart file upload API.
function uploadS3 (readStream, key, callback) {
  const upload = s3Stream.upload({
    'Bucket': 'thiscounts',
    'Key': 'videos/' + key
  });

  // Handle errors.
  upload.on('error', function (err) {
    callback(err);
  });

  // Handle progress.
  upload.on('part', function (details) {
    console.log(inspect(details));
  });

  // Handle upload completion.
  upload.on('uploaded', function (details) {
    callback();
  });

  // Pipe the Readable stream to the s3-upload-stream module.
  readStream.pipe(upload);
}

exports.upload = function(req, res) {
  // Create an Busyboy instance passing the HTTP Request headers.
  const busboy = new Busboy({ headers: req.headers });

  // Listen for event when Busboy finds a file to stream.
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

    // Handle uploading file to Amazon S3.
    // We are passing 'file' which is a ReadableStream,
    // 'filename' which is the name of the file
    // and a callback function to handle success/error.
    uploadS3(file, filename, function (err) {
      if (err) {
        res.statusCode = 500;
        res.end(err);
      } else {
        //TODO: start ElasticTranscoder
        res.statusCode = 200;
        res.end('ok');
      }
    });
  });
  // Pipe the HTTP Request into Busboy.
  req.pipe(busboy);
};

// Get list of videos
exports.index = function(req, res) {
  Video.find(function (err, videos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(videos);
  });
};

// Get a single video
exports.show = function(req, res) {
  Video.findById(req.params.id, function (err, video) {
    if(err) { return handleError(res, err); }
    if(!video) { return res.send(404); }
    return res.json(video);
  });
};

// Creates a new video in the DB.
exports.create = function(req, res) {
  Video.create(req.body, function(err, video) {
    if(err) { return handleError(res, err); }
    graphModel.reflect(video, function (err) {
      if (err) {  return handleError(res, err); }
    });
    return res.json(201, video);
  });
};

// Updates an existing video in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Video.findById(req.params.id, function (err, video) {
    if (err) { return handleError(res, err); }
    if(!video) { return res.send(404); }
    let updated = _.merge(video, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(video);
    });
  });
};

// Deletes a video from the DB.
exports.destroy = function(req, res) {
  Video.findById(req.params.id, function (err, video) {
    if(err) { return handleError(res, err); }
    if(!video) { return res.send(404); }
    video.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}