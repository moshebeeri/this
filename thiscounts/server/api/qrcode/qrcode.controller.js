'use strict';

let QRCode = require('./qrcode.model');
const QRCodeImg = require('qrcode');
const randomstring = require("randomstring");
const fs = require('fs');
const path = require('path');
const rootDir = path.normalize(`${path.resolve(__dirname)}`);


function allocate(quantity, userId){
  function allocated(err, qrcode) {
    if(err) {return console.log(err)}
    QRCodeImg.toDataURL(JSON.stringify({
      t: 'g',
      code: qrcode.code
    }), { errorCorrectionLevel: 'H', scale: 16 }, function (err, url) {
      if (err) {return console.log(err)}
      const base64Data = url.replace(/^data:image\/png;base64,/, '');
      console.log(`${rootDir}/codes/out.png`);
      fs.writeFile(`${rootDir}/codes/${(new Date()).getTime().toString()}.png`, base64Data, 'base64', function (err) {
        if (err) {return console.log(err)}
      });
    });
  }

  for(let i=0; i<quantity; i++)
    allocate_one(userId, allocated)
}

function allocate_one(userId, callback){
  QRCode.create({
    creator: userId,
    code: randomstring.generate({length: 10, charset: 'alphanumeric'})
  }, function (err, qrcode) {
    if (err) {
      if(callback) return callback(err);
      return console.error(err);
    }
    return callback(null, qrcode);
  })
}

function findQRCodeByCode(code, callback){
  QRCode.find({code: code}, function (err, qrcode) {
    if(err) { return callback(err); }
    callback(null, qrcode);
  })
}

// Get a single card
exports.show = function(req, res) {
  QRCode.find({code: req.params.code}, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return res.json(card);
  });
};

// Creates a new qrcode in the DB.
exports.allocate = function(req, res) {
  allocate(req.params.quantity, req.user._id);
  return res.status(201).send(req.params.quantity);
};

exports.assign = function(req, res) {
  findQRCodeByCode(req.params.code, function(err, qrcode) {
    if(err) { return handleError(res, err); }
    if(qrcode.assigned) {return res.status(304).json(qrcode)}
    qrcode.entities = req.body.entities;
    qrcode.type = req.type;
    qrcode.assigned = true;
    qrcode.save(function (err, qrcode) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(qrcode);
    })
  });
};

exports.createAndAssign = function(userId, data, callback){
  if(!data.entities || !data.type || !userId )
    return callback(new Error('invalid data'));

  allocate_one(userId, function(err, qrcode) {
    if(err) { return callback(err); }
    qrcode.entities = data.entities;
    qrcode.type = data.type;
    qrcode.assigned = true;
    qrcode.save(function (err, qrcode) {
      if(err) { return callback(err); }
      return callback(null, qrcode);
    })
  });
};

exports.allocateOneAndAssign = function(req, res) {
  this.createAndAssign(req.user._id, req.body, function (err, qrcode) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(qrcode);
  });
};

exports.code = function(req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if(err) { return handleError(res, err); }
    return res.json(qrcode);
  });
};

exports.image = function(req, res) {
  QRCodeImg.toDataURL(JSON.stringify({
    t:'g',
    code: req.params.code
  }), function (err, url) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json({
        qrcode: url
      });

  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
