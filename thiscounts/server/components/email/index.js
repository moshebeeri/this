'use strict';

const config = require('../../config/environment');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates');
var path = require('path');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'THIS@low.la',
    pass: 's3EE2rzhRtxA'
  }
});

function Email() {
}

Email.send = Email.prototype.send = function(template, to, locals, callback) {
  console.log(path.join(__dirname, 'templates'));
  let email =  new EmailTemplate({
    views: { root: path.join(__dirname, 'templates') },
    message: {
      from: 'THIS@low.la',
      // attachments: [
      //   {
      //     filename: 'THISLogo.png',
      //     path: path.join(__dirname, 'resources'),
      //     cid: 'THISLogo'
      //   }
      // ]
    },
    send: true,
    transport: transporter,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.join(__dirname, 'css')
      }
    }
  });

  email
    .send({
      template: template,
      message: {
        to: to
      },
      locals: locals
    })
    .then(console.log)
    .catch(console.error);
  callback(null)
};

Email.sendTest =
  Email.prototype.sendTest = function(callback) {
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


