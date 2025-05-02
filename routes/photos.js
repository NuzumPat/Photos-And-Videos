var debug = require('debug')('MySite10');
const modName = 'router/photos.js'  
debug('%s Start', modName);

var express = require('express');
var router = express.Router();
var myJsR = require('../public/js/myJsRoutines');  // ????? double periods ?????
var auth = require('http-auth');
var basic = auth.basic({
    realm: "PhotosVideos",
    file: __dirname + "/../public/data/mysite.htpasswd",
    msg401: "You Cancelled Photos Page. Go back one page to get to the previous Page"
});
var isDownloadComplete = require('../public/js/isDownloadComplete');


/* GET Photos page. */
if (g_authenicate_PhotosMenu == 'true') {
  router.get('/', auth.connect(basic), function(req, res) {
    err = myJsR.processLevel("/images/cs/Photos");
    if (err) {
      debug('%s myJsR.processLevel Error=' + err.message, modName);
    } else {
      if (isDownloadComplete.getDownloadComplete() === false) {
        res.render ('messages', {
            message:'This site is temporarily being Downloaded.',
            description:'Check back in a little while.'});
      } else {
        res.render('photos', { title: 'Photos Page'});
      }
    }
  });
} else {
  router.get('/', function(req, res) {
    err = myJsR.processLevel("/images/cs/Photos");
    if (err) {
      debug('%s myJsR.processLevel Error=' + err.message, modName);
    } else {
      if (isDownloadComplete.getDownloadComplete() === false) {
        res.render ('messages', {
            message:'This site is temporarily being Downloaded.',
            description:'Check back in a little while.'});
      } else {
        res.render('photos', { title: 'Photos Page'});
      }
    }
  });
}


basic.on('success', function(result, req) {
    console.log("Photos User authenticated: " + result.user);
});
 
basic.on('fail', function(result, req) {
  //debug('%s User authentication failed: ' + result.user, modName);
  //debug('%s This is a bug if it is the first time into this Page', modName);
});
 
basic.on('error', function(error, req) {
    debug('%s Authentication error: ' + error.code + ' - ' + error.message, modName);
});
debug('%s End', modName);
module.exports = router;
