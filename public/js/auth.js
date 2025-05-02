"use strict";
var debug = require('debug')('MySite10');
const modName = 'auth.js'  
debug('%s Start', modName);
/**
 * Simple example of authenticating CloudStorage services on a server
 * Visit localhost:12345/auth/start/dropbox, localhost:12345/auth/start/onedrive, ... to launch the flow
 */
const express = require("express");
const app = express();
const cloudrail = require("cloudrail-si");
var router = express.Router();
var isDownloadComplete = require(__dirname + '/isDownloadComplete');
var writeDownloadResults = require(__dirname + '/writeDownloadResults');

const port = 443;

var serviceFunction = require(__dirname + '/serviceFunction');
var serviceNamePhotosVideos = require(__dirname + '/globalServiceName');

cloudrail.Settings.setKey("580a3f96b54073739a8a67ce"); // License Key for my www.CloudRail.com Account (NuzumPat@msn.com)
var initFunction;
    
router.get("/start/:serviceName", (req, res) => {
    let serviceName = req.params["serviceName"];
    initFunction = serviceName.charAt(serviceName.length-1);
    serviceName = serviceName.slice(0,serviceName.length-1);

    // Get serviceName
    switch (initFunction) {
        case "1": // Update Photos & Videos
            if (serviceNamePhotosVideos.getPhotos() != serviceNamePhotosVideos.getVideos()) {
                res.render ('messages', {
                    message:'Photos and Videos Cloud Service must be the same, to perform this function',
                    description:'Go back one page to get back to DOWNLOAD page.'});
                return
            }
            serviceName = serviceNamePhotosVideos.getPhotos();
            debug('%s All Photos & Videos, serviceName=' + serviceName, modName);
            break;
        case "2": // Update Photos
            serviceName = serviceNamePhotosVideos.getPhotos();
            debug('%s All Photos, serviceName=' + serviceName, modName);
            break;
        case "3": // Update Videos
            serviceName = serviceNamePhotosVideos.getVideos();
            debug('%s All Videos, serviceName=' + serviceName, modName);
            break;
        case "4": // Add Photos & Videos
            if (serviceNamePhotosVideos.getPhotos() != serviceNamePhotosVideos.getVideos()) {
                res.render ('messages', {
                    message:'Photos and Videos Cloud Service must be the same, to perform this function',
                    description:'Go back one page to get back to DOWNLOAD page.'});
                return
            }
            serviceName = serviceNamePhotosVideos.getPhotos();
            debug('%s New Photos & Videos, serviceName=' + serviceName, modName);
            break;
        case "5": // Update Photos
            serviceName = serviceNamePhotosVideos.getPhotos();
            debug('%s New Photos, serviceName=' + serviceName, modName);
            break;
        case "6": // Update Videos
            serviceName = serviceNamePhotosVideos.getVideos();
            debug('%s New Videos, serviceName=' + serviceName, modName);
            break;
        case "7": // Results of Last Download
            var returnResults = writeDownloadResults.read();
            var cloudServiceName = returnResults[0];
            var serviceType = returnResults[1];
            var serviceErrors = returnResults[2];
            res.render ('messages', {
                message:'Cloud Service = ' + cloudServiceName + '; Type = ' + serviceType,
                    description:'Number of errors = ' + serviceErrors});
            break;
        default:
            debug('%s Invalid Function:initFunction=' + initFunction, modName);
            res.send('Invalid Function');
            return;
    }
    
    // debug('%s Before: let redirectReceiver = (url, state, callback)', modName);
    let redirectReceiver = (url, state, callback) => {
        // debug('%s 84 router.get:/start, res.redirect(url)=' + url, modName);
        res.redirect(url);
    };
    let service = makeService(serviceName, redirectReceiver, "state"); // You can change the last parameter if you need to identify incoming redirects
    // debug('%s 90 router.get:/start, service.login=' + serviceName, modName);
    service.login();    // No return from this fumction. It continues with the redirect service.login
});

router.get("/redirect/:serviceName", (req, res) => {
    let serviceName = req.params["serviceName"];
    // debug('%s 97 router.get:Redirect, serviceName=' + serviceName, modName);
    let redirectReceiver = (url, state, callback) => {
        // debug('%s 100 router.get:redirectReceiver, req.url=' + req.url, modName);
        callback(undefined, "http://bla.com" + req.url); // The callback expects a complete URL but only the query matters
    };
    let service = makeService(serviceName, redirectReceiver, "state");
    // debug('%s 105 router.get:let service, serviceName=' + serviceName, modName);
    service.login((err) => {
        if (err) {
            debug('%s router.get:User Denied Request, or', modName);
            debug('%s router.get:service.login Error=' + err.message, modName);
            // The Request was cancelled my the user
            res.redirect('/initialize');
            return;
        }
        // Now we are logged in, let's respond with the files in root
        // Pass control over to "Please Wait" Page
        //Save 'service', and Init-Function
        serviceFunction.set(initFunction, service);
        isDownloadComplete.setSocketInUse(false);
        res.redirect('/pleasewait');
    });
});

//app.listen(port);

function makeService(name, redirectReceiver, state) {
    let service;
    switch (name) {
        case "dropbox":
            service = new cloudrail.services.Dropbox(
                redirectReceiver,
                g_dropbox_client_id,
                g_dropbox_client_secret,
                g_domain_name + "/auth/redirect/dropbox",
                state
            );
            break;
        case "onedrive":
            service = new cloudrail.services.OneDrive(
                redirectReceiver,
                g_onedrive_client_id,
                g_onedrive_client_secret,
                g_domain_name + "/auth/redirect/onedrive",
                state
            );
            break;
        case "box":
            service = new cloudrail.services.Box(
                redirectReceiver,
                g_box_client_id,
                g_box_client_secret,
                g_domain_name + "/auth/redirect/box",
                state
            );
            break;
        case "drive":
            service = new cloudrail.services.GoogleDrive(
                redirectReceiver,
                g_drive_client_id,
                g_drive_client_secret,
                g_domain_name + "/auth/redirect/drive",
               state
            );
            break;
        // More services from CloudStorage can be added here, the services above are just examples
        debug('%s makeService-Unrecognized service=' + name, modName);
        default: throw new Error("Unrecognized service");
    }
    return service;
}
debug('%s End', modName);
module.exports = router;
