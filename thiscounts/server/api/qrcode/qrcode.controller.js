'use strict';
let QRCode = require('./qrcode.model');
const QRCodeImg = require('qrcode');
const randomstring = require("randomstring");
const fs = require('fs');
const path = require('path');
const rootDir = path.normalize(`${path.resolve(__dirname)}`);
const qr_opt = {errorCorrectionLevel: 'H', scale: 16};

function allocate(quantity, userId) {
  function allocated(err, qrcode) {
    if (err) {
      return console.log(err)
    }
    QRCodeImg.toFile(`${rootDir}/codes/${(new Date()).getTime().toString()}.png`, JSON.stringify({
      t: 'g',
      code: qrcode.code
    }), qr_opt, function (err) {
      if (err) {
        return console.log(err)
      }
    });
  }

  for (let i = 0; i < quantity; i++)
    allocate_one(userId, allocated)
}

function allocate_one(userId, callback) {
  QRCode.create({
    creator: userId,
    code: randomstring.generate({length: 12, charset: 'numeric'})
  }, function (err, qrcode) {
    if (err) {
      if (callback) return callback(err);
      return console.error(err);
    }
    return callback(null, qrcode);
  })
}

function findQRCodeByCode(code, callback) {
  QRCode.find({code: code}, function (err, qrcode) {
    if (err) {
      return callback(err);
    }
    callback(null, qrcode);
  })
}

// Get a single qrcode
exports.show = function (req, res) {
  QRCode.find({code: req.params.code}, function (err, code) {
    if (err) {
      return handleError(res, err);
    }
    if (!code) {
      return res.send(404);
    }
    return res.json(code);
  });
};
// Creates a new qrcode in the DB.
exports.allocate = function (req, res) {
  allocate(req.params.quantity, req.user._id);
  return res.status(201).send(req.params.quantity);
};
exports.assign = function (req, res) {
/*
TODO: This should be more affective
  QRCode.findOneAndUpdate({$and: [{code: req.params.code}, {assigned: false}]}, {
      assignment: req.body.assignment,
      action: req.body.action,
      type: req.type,
      assigned: true,
    }, {upsert: false}, function (err, qrcode) {
    if (err) return res.status(500).send(err);
    if(!qrcode) { return handleError(res, new Error(`code not find unsigned code ${req.params.code}`)); }
    return res.status(200).send('signed successfully');
  });
*/

  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if(err) { return handleError(res, err); }
    if(!qrcode) { return handleError(res, new Error(`code not found ${req.params.code}`)); }
    if(qrcode.assigned) { return handleError(res, new Error(`qrcode already assigned`)); }

    qrcode.assignment = req.body.assignment;
    qrcode.action = req.body.action;
    qrcode.type = req.type;
    qrcode.assigned = true;
    qrcode.save(function (err, qrcode) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(qrcode);
    })
  });

};

exports.createAndAssign = function (userId, data, callback) {
  if (!data.assignment || !data.type || !userId)
    return callback(new Error('invalid data'));
  allocate_one(userId, function (err, qrcode) {
    if (err) {
      return callback(err);
    }
    qrcode.assignment = data.assignment;
    qrcode.type = data.type;
    qrcode.action = data.action;
    qrcode.assigned = true;
    qrcode.save(function (err, qrcode) {
      if (err) {
        return callback(err);
      }
      return callback(null, qrcode);
    })
  });
};
exports.allocateOneAndAssign = function (req, res) {
  this.createAndAssign(req.user._id, req.body, function (err, qrcode) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(qrcode);
  });
};
exports.code = function (req, res) {
  QRCode.findOne({code: req.params.code}, function (err, qrcode) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(qrcode);
  });
};
exports.image_id = function (req, res) {
  QRCode.findById(req.params.id, function (err, qrcode) {
    if (err) {
      return handleError(res, err);
    }
    if (!qrcode) {
      res.status(404).send(`qrcode _id ${req.params.id} could not be found`);
    }
    QRCodeImg.toDataURL(JSON.stringify({
      code: qrcode.code
    }), qr_opt, function (err, url) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json({
        qrcode: url
      });
    })
  });
};

exports.image_code = function (req, res) {
  QRCodeImg.toDataURL(JSON.stringify({
    t: 'g',
    code: req.params.code
  }), qr_opt, function (err, url) {
    if (err) {
      return res.status(500).send(err);
    }
    res.setHeader('content-type', 'text/html');
    return res.status(200).send(`<html><body><img src="${url}"/></body></html>`);
  });
};

exports.allocateImage = function (req, res) {
  allocate_one(req.params.id, function (err, qrcode) {
    if (err) {
      return console.log(err)
    }
    QRCodeImg.toDataURL(JSON.stringify({
      t: 'g',
      code: qrcode.code
    }), function (err, url) {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.setHeader('content-type', 'text/html');
        return res.status(200).send(`<html><body><img src="${url}"/></body></html>`);
      }
    });
  })
};

function handleError(res, err) {
  return res.status(500).send(err);
}
