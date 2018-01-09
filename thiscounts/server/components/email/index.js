'use strict';

const config = require('../../config/environment');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'THIS@low.la',
    pass: 's3EE2rzhRtxA'
  }
});

function Email() {
}

Email.sendTest =
  Email.prototype.sendTest = function (email, callback) {
    //see https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799
    const mailOptions = {
      from: 'THIS@low.la', // sender address
      to: 'moshe.beeri@gmail.com', // list of receivers
      subject: 'Subject of your email', // Subject line
      html: '<p>Your html here</p>'// plain text body
    };

    transporter.sendMail(mailOptions, callback);
    // transporter.sendMail(mailOptions, function (err, info) {
    //   if(err)
    //     console.log(err);
    //   else
    //     console.log(info);
    // });

  //   let send = require('gmail-send')({
  //     user: 'THIS@low.la',
  //     // user: credentials.user,                  // Your GMail account used to send emails
  //     pass: 's3EE2rzhRtxA',
  //     to:   'moshe.beeri@gmail.com',
  //     // to:   credentials.user,                  // Send to yourself
  //     // you also may set array of recipients:
  //     // [ 'user1@gmail.com', 'user2@gmail.com' ]
  //     // from:    credentials.user             // from: by default equals to user
  //     // replyTo: credentials.user             // replyTo: by default undefined
  //     subject: 'test subject',
  //     text:    'gmail-send example 1',         // Plain text
  //     //html:    '<b>html text</b>'            // HTML
  //   });
  // send({
  //   to:   'moshe.beeri@gmail.com',
  //   subject: 'test subject',
  //   text:    'gmail-send example 1',         // Plain text
  // }, callback)
};



Email.prototype.handleFreeTier = function(payer, callback) {
};


module.exports = Email;


