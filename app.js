
//
var debug = require('debug')('MySite10');
const modName = 'app.js'  
debug('%s Start', modName);

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
// Global Variables
// configure site based on information in public/data/configure.json
var X_short_domain_name;
global.g_short_domain_name = X_short_domain_name;
var X_domain_name;
global.g_domain_name = X_domain_name;
var X_analytics_id;
global.g_analytics_id = X_analytics_id;

var X_authenicate_PhotosMenu;
global.g_authenicate_PhotosMenu = X_authenicate_PhotosMenu;

var X_authenicate_VideosMenu;
global.g_authenicate_VideosMenu = X_authenicate_VideosMenu;

var X_dropbox_client_id;
global.g_dropbox_client_id = X_dropbox_client_id;
var X_dropbox_client_secret;
global.g_dropbox_client_secret = X_dropbox_client_secret;

var X_dropBoxGetChildrenThrottle;
global.g_dropBoxGetChildrenThrottle = X_dropBoxGetChildrenThrottle;
var X_dropBoxDownloadThrottle;
global.g_dropBoxDownloadThrottle = X_dropBoxDownloadThrottle;

var X_onedrive_client_id;
global.g_onedrive_client_id = X_onedrive_client_id;
var X_onedrive_client_secret;
global.g_onedrive_client_secret = X_onedrive_client_secret;

var X_onedriveGetChildrenThrottle;
global.g_onedriveGetChildrenThrottle = X_onedriveGetChildrenThrottle;
var X_onedriveDownloadThrottle;
global.g_onedriveDownloadThrottle = X_onedriveDownloadThrottle;


var X_box_client_id;
global.g_box_client_id = X_box_client_id;
var X_box_client_secret;
global.g_box_client_secret = X_box_client_secret;

var X_boxGetChildrenThrottle;
global.g_boxGetChildrenThrottle = X_boxGetChildrenThrottle;
var X_boxDownloadThrottle;
global.g_boxDownloadThrottle = X_boxDownloadThrottle;


var X_drive_client_id;
global.g_drive_client_id = X_drive_client_id;
var X_drive_client_secret;
global.g_drive_client_secret = X_drive_client_secret;

var X_driveGetChildrenThrottle;
global.g_driveGetChildrenThrottle = X_driveGetChildrenThrottle;
var X_driveDownloadThrottle;
global.g_driveDownloadThrottle = X_driveDownloadThrottle;

var configure = require('./public/js/configure'); // 
configure.mysite(); 

// Routes / webpages
var index = require('./routes/index');
var about = require('./routes/about');
var photos = require('./routes/photos');
var videos = require('./routes/videos');
var contact = require('./routes/contact');
var initialize = require('./routes/initialize');
//var administrator = require('./routes/administrator');
var pleasewait = require('./routes/pleasewait');
var auth = require('./public/js/auth');  // Route for CloudRail Authenication 
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /'public/images/cs 
app.use(favicon(path.join(__dirname, 'public/images/cs', 'favicon.ico')));
//app.use(logger('dev'));   // GET being put in Debug Log
// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/about', about);
app.use('/photos', photos);
app.use('/videos', videos);
app.use('/contact', contact);
app.use('/initialize', initialize);
//app.use('/administrator', administrator);
app.use('/getCloudService', initialize);
app.use('/pleasewait', pleasewait);
app.use('/auth', auth);


// ***************** Process Navagation Menu Item ************************* 
var myJsRoutines = require('./public/js/myJsRoutines'); // 
  app.get('/navigation', function (req, res) {    // Wait for "$('.navigation').click(function" in navjs.js 
    var level = (req.query.level) || '';          // Navigation menu item clicked in Photos or Videos Page
    //console.log('MenuSelection:', level);
//   myJsRoutines.processLevel(level, function (err, result) { // call function to update .jade files
    err = myJsRoutines.processLevel(level); // call function to update .jade files
    if (err) {
        console.log('app.myJsRoutines:', err.message);
        res.status(500);
        return res.send(err);
      }
    var tempLength = level.length;
    level = level.slice(1, tempLength); // remove the leading 'm'
    // Now determine if it is from Photos or Video altnav
    tempLength = level.search("/images/cs/Videos");
    if (tempLength != -1) {
      res.render('videos', { title: 'Videos Page'});  // From Video
    } else {
      res.render('photos', { title: 'Photos Page'});  // From Photos
    }
//  });
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
debug('%s End', modName);
