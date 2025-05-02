
// New version added 03/25/2021
// There were 3 of these faiures: Error: Invalid login: 534-5.7.14
// Then it started working. I have no idea WHY?
//

var debug = require('debug')('MySite10');
const modName = 'router/contact.js'  
debug('%s Start', modName);
var express = require('express');
var router = express.Router();
//var setActivePage = require('../public/js/setActivePage');  // ????? double periods ?????
const fs = require('fs');   // fs - File System on Website Server
const path = require("path");
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var validator = require("email-validator");


/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log (router.contact);
  //setActivePage.setActivePage('contact');
  console.log('originalUrl=',req.originalUrl);
  res.render('contact', { title: 'Contact Use'});
});
router.get('/pdf', function(req, res, next) {
  //console.log (router.contact);
  //setActivePage.setActivePage('contact');
  console.log('pdf-originalUrl=',req.originalUrl);
  var tempPath = path.join(__dirname, '../'); // '..' means backup one folders to root
  tempPath = tempPath + "public/data/usersGuide.pdf";
  fs.readFile(tempPath , function (err,data){
      res.contentType("application/pdf");
      res.send(data);
  });
//}  res.render('contact', { title: 'Contact Use'});
});

//Mailer
router.post('/', function (req, res) {
  // listen for token updates (if refreshToken is set)
  // you probably want to store these to a db
//  generator.on('token', function(token){
//      console.log('New token for %s: %s', token.user, token.accessToken);
//  });
//. If company name part of form, this is Spam. ignore it
if (req.body.company) {
  console.log('Contact - Spam received');
  res.render ('contact', {
    description:'Spam'});
    return;
}
  //6/2/2021 If FirstName = LastName, this is Spam. ignore it
if ((req.body.first_name) == (req.body.last_name)) {
  console.log('Contact - Spam received');
  res.render ('contact', {
    description:'Spam'});
 return;
}

if (! req.body.first_name || ! req.body.last_name || ! req.body.email || ! req.body.message) {
  res.render ('messages', {
    message:'Please fill in all fields. email not sent.',
    description:'Go back one page to get back to CONTACT page.'});
 return;
}

// Check for valid email
var email_check = validator.validate(req.body.email);

if (email_check == false) {
  res.render ('messages', {
    message:'Not a valid email format. email not sent.',
    description:'Go back one page to get back to CONTACT page.'});
 return;
}
var msg_buffer = 'First Name: ' + req.body.first_name + '\n' + 'Last Name: ' + req.body.last_name + '\n' + 'eMail: ' + req.body.email + '\n' + req.body.message;
// ---------------------  New ---------------------------------//
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'JanetNuzum50@gmail.com',
    pass: 'wddw cuir moon ltwy'   // Chamged 5/17/2024
  }
});

var mailOptions = {
  from: 'fromJanetNuzum50@gmail.com@gmail.com',
  to: 'JanetNuzum50@gmail.com',
  subject: 'Sent From Photos And Videos website',
  text: msg_buffer
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    debug('%s Email FAIED:'+ error, modName);
    return console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    debug('%s Email sent:'+ info.response, modName);
    res.render('messages', {message: 'Message sent! Thank you. We will get in contact with you.', err: false, page: 'messages' })
  }
    debug('%s Email sent:'+ info.response, modName);
  console.log('After:   mailTransport.sendMail(mailOptions');
});
}); // end of ine 80
//-------------------New -------------------------//
debug('%s End', modName);
module.exports = router;
