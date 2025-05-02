// File = configure.js
// Function: Configure mysite based on content of public/data/configure.json File
// Called: From app.js when the site is first loaded and run. If configure.json is changed and deployed,
//         the app has to be stopped and started.
// Flow:
//  Update views/pleasewait.pug with the "domain-name"
//      var socket = io.connect('https://www.mysite10.com:3000');
//  Update views/includes/footer.pug with the "google-analytics-id"
//      ga('create', 'UA-87654710-1', 'auto');
//  Update public/js/auth.js with the "client-id", "client-secret", and "domain-name" for each of the cloud services
//      "yotcjvfvb0p2qz7",
//      "7juwdtvf4husaru",
//      "https://www.mysite10.com/auth/redirect/dropbox",
//
// 
var debug = require('debug')('MySite10');
const modName = 'configure.js'  
debug('%s Start', modName);
const fs = require('fs');   // fs - File System on Website Server
const path = require("path");

var configure = (function () {
  return {
    mysite: function (callback) {
        // Read configre.json and save setting
//        var short_domain_name = "";
//        var domain_name = "";
//        var analytics_id = "";
//        var dropbox_client_id = "";
//        var dropbox_client_secret = "";
//        var onedrive_client_id = "";
//        var onedrive_client_secret = "";
//        var box_client_id = "";
//        var box_client_secret = "";
//        var drive_client_id = "";
//        var drive_client_secret = "";
        var dirNameS = path.join(__dirname, '../data/configure.json');
        var contents = fs.readFileSync(dirNameS);
        // Define to JSON type
        var jsonContent = JSON.parse(contents);
        // Get Value from JSON
        g_short_domain_name = jsonContent.short_domain_name;
        g_domain_name = jsonContent.domain_name;
        g_analytics_id = jsonContent.google_analytics_id;
        g_authenicate_PhotosMenu = jsonContent.authenicate_PhotosMenu;
        g_authenicate_VideosMenu = jsonContent.authenicate_VideosMenu;

        g_dropbox_client_id = jsonContent.dropbox.client_id;
        g_dropbox_client_secret = jsonContent.dropbox.client_secret;
        g_dropBoxGetChildrenThrottle = jsonContent.dropbox.read_folder_throttle;
        g_dropBoxDownloadThrottle = jsonContent.dropbox.read_file_throttle;

        g_onedrive_client_id = jsonContent.onedrive.client_id;
        g_onedrive_client_secret = jsonContent.onedrive.client_secret;
        g_onedriveGetChildrenThrottle = jsonContent.onedrive.read_folder_throttle;
        g_onedriveDownloadThrottle = jsonContent.onedrive.read_file_throttle;

        g_box_client_id = jsonContent.box.client_id;
        g_box_client_secret = jsonContent.box.client_secret;
        g_boxGetChildrenThrottle = jsonContent.box.read_folder_throttle;
        g_boxDownloadThrottle = jsonContent.box.read_file_throttle;

        g_drive_client_id = jsonContent.drive.client_id;
        g_drive_client_secret = jsonContent.drive.client_secret;
        g_driveGetChildrenThrottle = jsonContent.drive.read_folder_throttle;
        g_driveDownloadThrottle = jsonContent.drive.read_file_throttle;
        // 11/8/2018 Start: Store Version Number in Log File
        var pjson = require('../../package.json');
        debug('package.json:version=' + pjson.version);
        // 11/8/2018 End

        //console.log("configure.json:domain_name=", g_domain_name);
        debug('%s configure.json:domain_name=' + g_domain_name, modName);
        debug('%s configure.json:analytics_id=' + g_analytics_id, modName);
        //console.log("configure.json:analytics_id=", g_analytics_id);
        //  Update views/pleasewait.pug with the "domain-name"
        //      var socket = io.connect('https://www.mysite10.com:3000');
        var dirNameS = path.join(__dirname, '../../views/pleasewait.pug');
        var contents = fs.readFileSync(dirNameS,"utf8");
        // var config_domain_name = "http://localhost:3000"; 
        var ib = contents.indexOf('var config_domain_name = "');  // index of beginning
        ib = ib + 26; // Lenght to copy 
        var ie = contents.indexOf('";   // Configured automatically'); // index of ending
        var results = contents.slice(ib, ie);
        //console.log('configure-pleasewait.pug-Replace:' + results + ' With:' + g_domain_name);
        debug('%s configure-pleasewait.pug-Replace:' + results + ' With:' + g_domain_name, modName);
        contents = contents.replace(results, g_domain_name);
        fs.writeFileSync(dirNameS,contents);
        // Update views/includes/footer.pug with the "google-analytics-id"
        // ga('create', 'UA-87654710-1', 'auto');
        dirNameS = path.join(__dirname, '../../views/includes/footer.pug');
        contents = fs.readFileSync(dirNameS,"utf8");
        ib = contents.indexOf("ga('create', '");  // index of beginning
        ib = ib + 14; // Lenght to copy 
        ie = contents.indexOf("', 'auto');"); // index of ending
        results = contents.slice(ib, ie);
        debug('%s configure-footconfigure-footer.pug-Replace:' + results + ' With:' + g_analytics_id, modName);
        contents = contents.replace(results, g_analytics_id);
        // Update views/includes/footer.pug with the "Domain Name"
        //  p &copy; Copyright 2016 - MySite10.com - All rights reserved.
        ib = contents.indexOf("2016 - ");  // index of beginning
        ib = ib + 7; // Lenght to copy 
        ie = contents.indexOf(" - All rights"); // index of ending
        results = contents.slice(ib, ie);
        debug('%s configure-footer.pug-Replace:' + results + ' With:' + g_short_domain_name, modName);
        contents = contents.replace(results, g_short_domain_name);
        fs.writeFileSync(dirNameS,contents);
    }
  }

}()); // function executed so configure is an object
debug('%s End', modName);
module.exports = configure;