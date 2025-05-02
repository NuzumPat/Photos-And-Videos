var debug = require('debug')('MySite10');
const modName = 'router/initialize.js'  
debug('%s Start', modName);
var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var http = require('http');
var serviceNamePhotosVideos = require('../public/js/globalServiceName');  // ????? double periods ?????
var readCloudSerciveFile = require('../public/js/download_cs');

// Authentication module.
// Use the "Basic Authentication":
//  The client sends the user name and password as unencrypted base64 encoded text. 
//  It should only be used with HTTPS, as the password can be easily captured and reused over HTTP
//   https://www.httpwatch.com/httpgallery/authentication/
//  The Authorization specifies the authentication mechanism (in this case Basic) followed by the username and password. 
//  Although, the string aHR0cHdhdGNoOmY= may look encrypted it is simply a base64 encoded version of <username>:<password>. 
//  In this example, the un-encoded string "httpwatch:foo" was used and would be readily available to anyone who could 
//  intercept the HTTP request.
//  htpasswd - Node.js package for HTTP Basic Authentication password file utility.
//  Use this website to create users.htpasswd file:http://www.htaccesstools.com/htpasswd-generator/
//  Once you sign in with a valide username password, you will no to ask to sign in again, until this file changed


var auth = require('http-auth');
var basic = auth.basic({
    realm: "Initialization",
    file: __dirname + "/../public/data/users.htpasswd",
    msg401: "You Cancelled Download Page. Go back one page to get to the previous Page"
});
var isDownloadComplete = require('../public/js/isDownloadComplete');
var res; 

router.get('/', auth.connect(basic), function(req, res) {
  if (isDownloadComplete.getDownloadComplete() === false) {
    res.render('pleasewait', { title: 'Please Wait'});
    return;
  }
    var tempCSBuffer;
    readCloudSerciveFile.readCloudSerciveFile(function(err, tempCSBuffer) {
        if (err) {
            res.render ('messages', {
                message:'There is a CRITICAL ERROR reading /public/data/cloudService.txt',
                description:'Report this to your Support Team'});
            return;
        } 
        if (req.baseUrl == '/getCloudService'){ 
            // This is from selecting <Submit> on the Download/Initialize Page.
            //  Write the url string out to /data/cloudService.txt
            var fd = fs.openSync(__dirname + "/../public/data/cloudService.txt", 'w+');   // w+ truncate if exists
            var lengthWriten = fs.writeSync(fd, req.url + '\r\n');
            err = fs.closeSync(fd);

            // Save ServiceName in global function
            // '/?selectphotos=4&selectvideos=4'
            // Photos
            switch (req.url.charAt(15)) {
                case "0": // OneDrive
                case "1": // OneDrive
                    serviceNamePhotosVideos.setPhotos('onedrive');
                    break;
                case "2": // Google  Drive
                    serviceNamePhotosVideos.setPhotos('drive');
                    break;
                case "3": // DropBox
                    serviceNamePhotosVideos.setPhotos('dropbox');
                    break;
                case "4": // Box
                    serviceNamePhotosVideos.setPhotos('box');
                    break;
                default:
                    //console.log("selectphotos= ,not valid");
                    err = "selectphotos= ,not valid";
                    return (err);
            }
            // Videos
            switch (req.url.charAt(30)) {
                case "0": // OneDrive
                case "1": // OneDrive
                    serviceNamePhotosVideos.setVideos('onedrive');
                    break;
                case "2": // Google  Drive
                    serviceNamePhotosVideos.setVideos('drive');
                    break;
                case "3": // DropBox
                    serviceNamePhotosVideos.setVideos('dropbox');
                    break;
                case "4": // Box
                    serviceNamePhotosVideos.setVideos('box');
                    break;
                default:
                    //console.log("selectVideos= ,not valid");
                    err = "selectVideos= ,not valid";
                    return (err);
            }
            // Now Write out a new initialize_cloud_service.pug with these selections
            lengthWriten = req.url.indexOf("photos=") + 7;
            var photos_cs = req.url.charAt(lengthWriten);
            lengthWriten = req.url.indexOf("videos=") + 7;
            var videos_cs = req.url.charAt(lengthWriten);
            if (photos_cs == '0' || videos_cs == '0') {
                res.render ('messages', {
                    message:'You need to select both Photos and Videos Cloud Service',
                    description:'Go back one page to get back to DOWNLOAD page.'});
                return;
            }
            // The following is a jQuery Script that is included in views/layoutInitialize.pug
            // It displays the selected Photos and Videos Cloud Service names.
            var record1 = 'script.' + '\r\n';
            var record2 = '    jQuery(document).ready(function ($) {' + '\r\n';
            var record3 = '    var temp="' + photos_cs + '";' + '\r\n';
            var record4 = '    $("#selectphotos").val(temp);' + '\r\n';
            var record5 = '    temp="' + videos_cs + '";' + '\r\n';
            var record6 = '    $("#selectvideos").val(temp);' + '\r\n';
            var record7 = '    })' + '\r\n'; 
            // write this out 
            var fd = fs.openSync(__dirname + "/../views/includes/initialize_cloud_service.pug", 'w+');   // w+ truncate if exists
            var lengthWriten = fs.writeSync(fd, record1 + record2 + record3 + record4 + record5 + record6 + record7);
            err = fs.closeSync(fd);
            return
        }
        res.render('initialize', { title: 'MySite10 initialize' });
    });
});

basic.on('success', function(result, req) {
    console.log("User authenticated: " + result.user);
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
