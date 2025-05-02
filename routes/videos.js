var debug = require('debug')('MySite10');
const modName = 'router/videos.js'  
debug('%s Start', modName);
var express = require('express');
var router = express.Router();
var myJsR = require('../public/js/myJsRoutines');  // ????? double periods ?????
//var setActivePage = require('../public/js/setActivePage');  // ????? double periods ?????
  //setActivePage.setActivePage('videos');
var auth = require('http-auth');
var basic = auth.basic({
    realm: "PhotosVideos",
    file: __dirname + "/../public/data/mysite.htpasswd",
    msg401: "You Cancelled Videos Page. Go back one page to get to the previous Page"
});
var isDownloadComplete = require('../public/js/isDownloadComplete');

/* GET Video  page. */
if (g_authenicate_VideosMenu == 'true') {
    router.get('/', auth.connect(basic), function(req, res) {
    err = myJsR.processLevel("/images/cs/Videos")
    if (err) {
      debug('%s myJsR.processLevel Error=' + err.message, modName);
    } else {
      if (isDownloadComplete.getDownloadComplete() === false) {
        res.render ('messages', {
            message:'This site is temporarily being Downloaded.',
            description:'Check back in a little while.'});
      } else {
        res.render('videos', { title: 'Videos Page'});
      }
    }
  });
} else {
    router.get('/', function(req, res) {
    err = myJsR.processLevel("/images/cs/Videos")
    if (err) {
      debug('%s myJsR.processLevel Error=' + err.message, modName);
    } else {
      if (isDownloadComplete.getDownloadComplete() === false) {
        res.render ('messages', {
            message:'This site is temporarily being Downloaded.',
            description:'Check back in a little while.'});
      } else {
        res.render('videos', { title: 'Videos Page'});
      }
    }
  });
}
  // Copy the three initial videos jade files ("/images/cs/Videos")
//  myJsR.processLevel("/images/cs/Videos", function (err, result) {
basic.on('success', function(result, req) {
  console.log("Videos User authenticated: " + result.user);
});
 
basic.on('fail', function(result, req) {
  //debug('%s User authentication failed: ' + result.user, modName);
  //debug('%s This is a bug if it is the first time into this Page', modName);
});
 
basic.on('error', function(error, req) {
    debug('%s Videos Authentication error: ' + error.code + ' - ' + error.message, modName);
});
debug('%s End', modName);
module.exports = router;
