// module download_cs.js
/********************************************************************************************************
// download_cs.js
This .js file contains the functions that are used to download the folders and files from the Cloud Service (cs)

********************************************************************************************************/
"use strict";
//console.log('Start download_cs.js');
var debug = require('debug')('MySite10');
const modName = 'download_cs.js'  
debug('%s Start', modName);
// cs - Cloud Service
const cs_root_dir = "/myWebsite";   //  root of Cloud Service folder
const cs_root_dir_photos = cs_root_dir + "/Photos";     // Photos folder
const cs_root_dir_videos = cs_root_dir + "/Videos";     // Videos folder
// fs - File System in Website 
const fs_root_dir_images_cs = "/images/cs";      // This folder is where we start downloading from cs. If it is not there, there is a serious problem
const fs_root_dir_photos = fs_root_dir_images_cs + "/Photos";   // photos's root directory on Website Server
const fs_root_dir_videos = fs_root_dir_images_cs + "/Videos";   // vhotos's root directory on Website Server

const fs = require('fs');   // fs - File System on Website Server
const path = require("path");
// const http = require("http");
// var express = require('express');
// var app = express();
var d_serviceName = "";   // 'drive', onedrive, dropbox, box
const DRIVE = 'drive';
const ONEDRIVE = 'onedrive';
const DROPBOX = 'dropbox';
const BOX = 'box';

//var throttle = require('lodash.throttle');
//var _ = require('lodash');

// Connect to OneDrive
//const cloudrail = require("cloudrail-si");
//cloudrail.Settings.setKey("[CloudRail license key]");   // Added for DropBox

const port = 443; // LocalHost port to offline testing
//const stream = require('stream');
// ????? The next line has to be there or this module will NOT load ?????
var cs;             // This will be assigned to the Cloud Rail cloud service 
//var cs = csDrive; 
var bytesWrittenToFS = 0;   // Tracks total length in bytes written to File 


var didDownloadFail = require(__dirname + '/didDownloadFail');
//var dummy = require(__dirname + '/auth');


exports.varBytesWrittenToFS = function varBytesWrittenToFS () {
    return (bytesWrittenToFS);
}
function assignSameCloudService(callback) {
//    cs = csOnedrive;
    var csSetting = "";
    getCSPhotosSetting(function(err, csSetting) {
        if (err) return callback (err);
        switch (csSetting) {
            case "1": // OneDrive
                d_serviceName = ONEDRIVE;
                GetChildrenThrottle = g_onedriveGetChildrenThrottle;
                DownloadThrottle = g_onedriveDownloadThrottle;
                break;
            case "2": // Drive
                d_serviceName = DRIVE;
                GetChildrenThrottle = g_driveGetChildrenThrottle;
                DownloadThrottle = g_driveDownloadThrottle;
                break;
            case "3": // DropBox
                d_serviceName = DROPBOX;
                GetChildrenThrottle = g_dropBoxGetChildrenThrottle;
                DownloadThrottle = g_dropBoxDownloadThrottle;
                break;
            case "4": // Box
                d_serviceName = BOX;
                GetChildrenThrottle = g_boxGetChildrenThrottle;
                DownloadThrottle = g_boxDownloadThrottle;
                break;
            default:
                debug('%s assignSameCloudService= ,not valid=' + csSetting, modName);
                //console.log("selectphotos= ,not valid");
                err = "selectphotos= ,not valid";
                return callback (err);
        }
        globalServiceName.setPhotos(d_serviceName);
        globalServiceName.setGetChildrenThrottle(GetChildrenThrottle);
        globalServiceName.setDownloadThrottle(DownloadThrottle);
        return callback (err);
    });
}

function assignPhotosCloudService(callback) {
    var csSetting = "";
    getCSPhotosSetting(function(err, csSetting) {
        if (err) return callback (err);
        switch (csSetting) {
            case "1": // OneDrive
                d_serviceName = ONEDRIVE;
                GetChildrenThrottle = g_onedriveGetChildrenThrottle;
                DownloadThrottle = g_onedriveDownloadThrottle;
                break;
            case "2": // Drive
                d_serviceName = DRIVE;
                GetChildrenThrottle = g_driveGetChildrenThrottle;
                DownloadThrottle = g_driveDownloadThrottle;
                break;
            case "3": // DropBox
                d_serviceName = DROPBOX;
                GetChildrenThrottle = g_dropBoxGetChildrenThrottle;
                DownloadThrottle = g_dropBoxDownloadThrottle;
                break;
            case "4": // Box
                d_serviceName = BOX;
                GetChildrenThrottle = g_boxGetChildrenThrottle;
                DownloadThrottle = g_boxDownloadThrottle;
                break;
            default:
                debug('%s assignPhotosCloudService= ,not valid=' + csSetting, modName);
                //console.log("selectphotos= ,not valid");
                err = "selectphotos= ,not valid";
                return callback (err);
        }
        globalServiceName.setPhotos(d_serviceName);
        globalServiceName.setGetChildrenThrottle(GetChildrenThrottle);
        globalServiceName.setDownloadThrottle(DownloadThrottle);
        return callback (err);
    });
}
 
function assignVideosCloudService(callback) {
    var csSetting = "";
    getCSVideoSetting(function(err, csSetting) {
        if (err) return callback (err);
        switch (csSetting) {
            case "1": // OneDrive
                d_serviceName = ONEDRIVE;
                GetChildrenThrottle = g_onedriveGetChildrenThrottle;
                DownloadThrottle = g_onedriveDownloadThrottle;
                break;
            case "2": // Drive
                d_serviceName = DRIVE;
                GetChildrenThrottle = g_driveGetChildrenThrottle;
                DownloadThrottle = g_driveDownloadThrottle;
                break;
            case "3": // DropBox
                d_serviceName = DROPBOX;
                GetChildrenThrottle = g_dropBoxGetChildrenThrottle;
                DownloadThrottle = g_dropBoxDownloadThrottle;
                break;
            case "4": // Box
                d_serviceName = BOX;
                GetChildrenThrottle = g_boxGetChildrenThrottle;
                DownloadThrottle = g_boxDownloadThrottle;
                break;
            default:
                console.log("selectphotos= ,not valid");
                err = "selectphotos= ,not valid";
                return callback (err);
        }
        globalServiceName.setVideos(d_serviceName);
        globalServiceName.setGetChildrenThrottle(GetChildrenThrottle);
        globalServiceName.setDownloadThrottle(DownloadThrottle);
        return callback (err);
    });
}
var globalServiceName = require(__dirname + '/globalServiceName');  // ????? double periods ?????

var readCloudSerciveFile = require(__dirname + '/download_cs');
// Function: Set the globalServiceNames for Photos and Videos from cloudService.txt
// Parameters: callback (err, buffer). buffer is content of /public/data/cloudService.txt
exports.readCloudSerciveFile = function readCloudSerciveFile (callback) {
    var tempPath = path.join(__dirname, '../..'); // '..' means backup two folders to root
    tempPath = tempPath + "/public/data/cloudService.txt";
    var buffer = "";
    fs.readFile(tempPath,'utf8',function (err, buffer) {
        if (err) {
            //console.log("readCloudSerciveFile;cloudService.txt Read failed:",err);
            debug('%s readCloudSerciveFile;cloudService.txt Read failed:' + err, modName);
            didDownloadFail.setdidDownloadFail(true, 'Error reading cloudService.txt file - Try again');
            return callback(err);
        }
        switch (buffer.charAt(15)) {
            case "0": 
            case "1": // OneDrive
                globalServiceName.setPhotos('onedrive');
                break;
            case "2": // Google  Drive
                globalServiceName.setPhotos('drive');
                break;
            case "3": // DropBox
                globalServiceName.setPhotos('dropbox');
                break;
            case "4": // Box
                globalServiceName.setPhotos('box');
                break;
            default:
                //console.log("selectphotos= ,not valid");
                err = "selectphotos= ,not valid";
                return (err);
        }
        // Videos
        switch (buffer.charAt(30)) {
            case "0":
            case "1": // OneDrive
                globalServiceName.setVideos('onedrive');
                break;
            case "2": // Google  Drive
                globalServiceName.setVideos('drive');
                break;
            case "3": // DropBox
                globalServiceName.setVideos('dropbox');
                break;
            case "4": // Box
                globalServiceName.setVideos('box');
                break;
            default:
                //console.log("selectVideos= ,not valid");
                err = "selectVideos= ,not valid";
                return (err);
        }

        return callback (err, buffer);
    });
}
var writeCloudSerciveFile = require(__dirname + '/download_cs');
exports.writeCloudSerciveFile = function writeCloudSerciveFile (callback) {
    var tempPath = path.join(__dirname, '../..'); // '..' means backup two folders to root
    tempPath = tempPath + "/public/data/cloudService.txt";
    var buffer = "";
    fs.readFile(tempPath,'utf8',function (err, buffer) {
        if (err) {
            debug('%s writeCloudSerciveFile;cloudService.txt Read failed:' + err, modName);
            //console.log("assignCloudService;cloudService.txt Read failed:",err);
            didDownloadFail.setdidDownloadFail(true, 'Error reading cloudService.txt file - Try again');
            return callback(err);
        }
        switch (buffer.charAt(15)) {
            case "0":
            case "1": // OneDrive
                globalServiceName.setPhotos('onedrive');
                break;
            case "2": // Google  Drive
                globalServiceName.setPhotos('drive');
                break;
            case "3": // DropBox
                globalServiceName.setPhotos('dropbox');
                break;
            case "4": // Box
                globalServiceName.setPhotos('box');
                break;
            default:
                //console.log("selectphotos= ,not valid");
                err = "selectphotos= ,not valid";
                return (err);
        }
        // Videos
        switch (buffer.charAt(30)) {
            case "0": 
            case "1": // OneDrive
                globalServiceName.setVideos('onedrive');
                break;
            case "2": // Google  Drive
                globalServiceName.setVideos('drive');
                break;
            case "3": // DropBox
                globalServiceName.setVideos('dropbox');
                break;
            case "4": // Box
                globalServiceName.setVideos('box');
                break;
            default:
                //console.log("selectVideos= ,not valid");
                err = "selectVideos= ,not valid";
                return (err);
        }
        return callback (err, buffer);
    });
}

function getCSPhotosSetting(callback) {
    var tempCSBuffer = "";
    readCloudSerciveFile.readCloudSerciveFile(function(err, tempCSBuffer) {
        if (err) return callback (err);
        var n = tempCSBuffer.lastIndexOf("selectphotos=");
        var res = tempCSBuffer.charAt(n+13);
        //console.log('Photo CS Selected=', res)
        return callback (err, res);
    });
}

function getCSVideoSetting(callback) {
    var tempCSBuffer = "";
    readCloudSerciveFile.readCloudSerciveFile( function(err, tempCSBuffer) {
        if (err) return callback (err);
        var n = tempCSBuffer.lastIndexOf("selectvideos=");
        var res = tempCSBuffer.charAt(n+13);
        //console.log('Video CS Selected=', res)
        return callback (err, res);
    });
}

function validateSameCloudService(callback) {
    var photo = "";
    var video = "";
    getCSPhotosSetting(function(err, photo) {
        if (err) return callback (err);
        getCSVideoSetting(function(err, video) {
            if (err) return err;
            if (photo === video) return callback (err, true);
            return callback (err, false);
        });
    });
}
var queueLength = require(__dirname + '/queueLength');
// var ExifImage = require('exif').ExifImage;
//var itemsOnQueue= 0;
// Throttle Queue
function RateLimit(fn, delay, context) {
  var queue = [], timer = null;

  function processQueue() {
    // If download and ChildrenSemaphore not zero, leave it on the queue
    var item = queue[0];
    var arg1Str = item.arguments[1].toString();
    var n = arg1Str.indexOf("function (err, downStream)");
    if (n === 0 && getChildrenSemaphore > 0) {
        // Leave it on the queue
        //console.log("1")
    } else {
        var item = queue.shift();   // item already declared
        if (item)
            fn.apply(item.context, item.arguments);
//        itemsOnQueue = queue.length;
        if (queue.length === 0)
            clearInterval(timer), timer = null;
        }
        if (n === 0) {
            queueLength.setQueueLengthFile(queue.length);
        } else {
            queueLength.setQueueLengthPath(queue.length);
        }
    }
  return function limited() {
    queue.push({
        context: context || this,
        arguments: [].slice.call(arguments)
    });
    if (!timer) {
//      processQueue();  // start immediately on the first invocation
      timer = setInterval(processQueue, delay);
    }
  };
}
var fileSystemPreviousSize = 1;
var isFileSystemActiveTF = false;
var fileSystemCurrentSize = 0;
function getFSSize (fs_path) {
    var nLength = 0;    
//    var fsdirname = path.join(__dirname, '..'); // '..' means backup one folder
    fs.readdirSync(fs_path).forEach(function(file,index){
        var curPath = fs_path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
            getFSSize(curPath);
        } else {
            
            var stats = fs.lstatSync(curPath);       
            nLength = nLength + stats.size;       
 //           nLength = nLength + file.length;       
        }
    }) // end For Loop
    fileSystemCurrentSize = fileSystemCurrentSize + nLength;
}      

// Sample the File System to determine if files are still being written
// This is the only way I know of to determine when an Update or Add has completed
// Read the size of public/cs every 5 seconds to determine if the size has changed.
// When there hasn't been a folder size change in 5 seconds, process click_CreateJade
function isFileSystemActive(){
    var fsdirname = path.join(__dirname, '..'); // '..' means backup one folder
    fsdirname = fsdirname + "/images/cs";
    getFSSize(fsdirname);
    //consol.log ('queueSize=',queueSize());
    if ((fileSystemCurrentSize === fileSystemPreviousSize) && (queueLength.getQueueLengthTotal() === 0)) {
        isFileSystemActiveTF = false; // download complete
        fileSystemPreviousSize = 1;
        //console.log('isFileSystemActive-click_CreateJade-download done');
        click_CreateJade(); // process .pug include files
    } else {
        fileSystemPreviousSize = fileSystemCurrentSize;
        fileSystemCurrentSize = 0;
        // Start Timer again
        setTimeout(function(){
            isFileSystemActive();
        }, 10000);  // Wait 60 secounds for Chrome
    }
}
var initialQueueWaitCounter = 0;
function isQueueEmpty(){

    if (initialQueueWaitCounter === 0){
        initialQueueWaitCounter = initialQueueWaitCounter + 1;
        setTimeout(function(){
            isQueueEmpty();
        }, 10000);  // Wait 10 secounds and check again
        return;
    }
    if (queueLength.getQueueLengthTotal() === 0){
        // This may be the case where the folder queue went to zero. Wait and see
        if (isFileSystemActiveTF === true) {
            return; // let filesystem let us know when download complete
        }
        isFileSystemActiveTF = false; // download complete
        //debug('%s isQueueEmpty-click_CreateJade-download done', modName);
        //console.log('isQueueEmpty-click_CreateJade-download done');
        click_CreateJade(); // process .pug include files
    } else {
        // Start Timer again
        setTimeout(function(){
            isQueueEmpty();
        }, 5000);  // Wait 5 secounds and check again
    }
}

function isImageFile(fileName) {
    var fileType;
    var indexfileType;
    indexfileType = fileName.lastIndexOf(".");
    fileType = fileName.slice(indexfileType+1,fileName.length);
    fileType = fileType.toLowerCase();
    if(fileType === 'jpg' ||
        fileType === "pug" ||
        fileType === "txt" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "pdf" ||
        fileType === "gif" ||
        fileType === "tiff" ||
        fileType === "bmp" ||
        fileType === "svg" ||
        fileType === "ico" ||
        fileType === "m4v" ||
        fileType === "ogv" ||
        fileType === "web") return true;
        return false;
}

var GetChildrenThrottle;
var DownloadThrottle;
// These next 2 lines can't be created until the correct cs has been assigned'
//var RateLimitGetChildren = RateLimit(cs.getChildren, GetChildrenThrottle, cs);
//var RateLimitDownload = RateLimit(cs.download, DownloadThrottle, cs);
var RateLimitGetChildren = null;
var RateLimitDownload =null;
var getChildrenSemaphore = 0;
var downkloadSemaphore = 0;
var err_ECONNRESET = 0;
var err_ETIMEDOUT  = 0;
var err_FORBIDDEN = 0;
var err_UNKNOWN  = 0;
var isDownloadComplete = require(__dirname + '/isDownloadComplete');  // ????? double periods ?????


// Make 3 exports that call one function All,Photos, & Videos
exports.click_UpdateImages = function click_UpdateImages () {
    isDownloadComplete.setDownloadComplete(false);
    didDownloadFail.setdidDownloadFail(false,'');

    //Validate that the same cs was selected Initialize page
    validateSameCloudService(function(err,result) {
        if (err) return err;
        if (result === false) {
            // Invalid Entry. Send Error message to user
            didDownloadFail.setdidDownloadFail(true, 'Error: You have two different cloud services selected for a function that required them to be the same.');
           return;
        }
        assignSameCloudService(function(err){
            if (err) return err;
            UpdateImages(cs_root_dir, fs_root_dir_images_cs, function (err){
                if(err) {
                    debug('%s Error:exports.click_UpdateImages - err.message:' + err.message, modName);
                    debug('%s Error:exports.click_UpdateImages - err:' + err, modName);
                    //console.log("Error:exports.click_UpdateImages - err.message:" + err.message);
                    //console.log("Error:exports.click_UpdateImages - err:" + err);
                }
                // 1/12/2018 Good status never returned, or download errors never returned, just a fatal error
            });
        }
    )}      // missing semicolon
)};         // missing semicolon

exports.click_UpdatePhotos = function click_UpdatePhotos () {
    isDownloadComplete.setDownloadComplete(false);
    didDownloadFail.setdidDownloadFail(false,'');
    assignPhotosCloudService(function(err){
        if (err) return err;
        UpdateImages(cs_root_dir_photos, fs_root_dir_photos, function (err){
            if(err) {
                debug('%s Error:exports.click_UpdatePhotos - err.message:' + err.message, modName);
                //debug('%s Error:exports.click_UpdatePhotos', modName);
                //console.log("Error:exports.click_UpdatePhotos");
            }
        }
    )}  // missing semicolon
)};     // missing semicolon

exports.click_UpdateVideos = function click_UpdateVideos () {
    isDownloadComplete.setDownloadComplete(false);
    didDownloadFail.setdidDownloadFail(false,'');
    assignVideosCloudService(function(err){
        if (err) return err;
        UpdateImages(cs_root_dir_videos, fs_root_dir_videos, function (err){
            if(err) {
                debug('%s Error:exports.click_Videos - err.message:' + err.message, modName);
                //debug('%s Error:exports.click_UpdateVideos', modName);
                //console.log("Error:exports.click_UpdateVideos")
            }
        }
    )}
)};
// Make 3 exports that call one function to add new (All,Photos, & Videos)
exports.click_UpdateAddedImages = function click_UpdateAddedImages () {
    isDownloadComplete.setDownloadComplete(false);
    didDownloadFail.setdidDownloadFail(false,'');
    validateSameCloudService(function(err,result) {
        if (err) return err;
        if (result === false) {
            didDownloadFail.setdidDownloadFail(true, 'Error: You have two different cloud services selected for a function that required them to be the same.');
            return;
        }
        assignSameCloudService(function(err){
            if (err) return err;
            AddImages(cs_root_dir, fs_root_dir_images_cs, function (err){
                if(err) {
                    debug('%s Error:exports.click_UpdateAddedImages - err.message:' + err.message, modName);
                    //debug('%s Error:exports.click_UpdateAddedImages', modName);
                    //console.log("Error:exports.click_UpdateAddedImages")
                }
            });
        }
    )}
)};

exports.click_UpdateAddedPhotos = function click_UpdateAddedPhotos () {
    isDownloadComplete.setDownloadComplete(false);
    didDownloadFail.setdidDownloadFail(false,'');
    // debug('%s 547', modName);
    assignPhotosCloudService(function(err){
        if (err) return err;
        // debug('%s 550', modName);
        AddImages(cs_root_dir_photos, fs_root_dir_photos, function (err){
            if(err) {
                debug('%s Error:exports.click_UpdateAddedPhotos - err.message:' + err.message, modName);
                // debug('%s Error:exports.click_UpdateAddedPhotos', modName);
                //console.log("Error:exports.click_UpdateAddedPhotos")
            } else {
                // debug('%s 557', modName);
                didDownloadFail.setdidDownloadFail(false, '');
                // debug('%s 559', modName);
            }
        }
    )}
)};

exports.click_UpdateAddedVideos = function click_UpdateAddedVideos () {
    isDownloadComplete.setDownloadComplete(false);
    didDownloadFail.setdidDownloadFail(false,'');
    assignVideosCloudService(function(err){
        if (err) return err;
        AddImages(cs_root_dir_videos, fs_root_dir_videos, function (err){
            if(err) {
                debug('%s Error:exports.click_UpdateAddedVideos - err.message:' + err.message, modName);
            }
        }
    )}
)};

var serviceFunction = require(__dirname + '/serviceFunction');
// Function: Add NEW image files
// Read 
var AddImages = function (cs_path, fs_path, callback) {
    bytesWrittenToFS= 0;
    updateGlobalErrors.setUpdateGlobalErrors(0,0,0,0);
    err_ECONNRESET = 0;
    err_ETIMEDOUT  = 0;
    err_FORBIDDEN = 0;
    err_UNKNOWN  = 0;
    //remove the last three characters (/js)
    var fsdirname = path.join(__dirname, '..'); // '..' means backup one folder
    // Connect to CS and make sure the folder there

    cs = serviceFunction.getService();
    // Perform the Authenticat  ion of the CS
    connect_CS (cs_path, function(err, exists) {
        if(err) {
            //console.log("Connection to Cloud Service Failed or was Denied");
            debug('%s Connection to Cloud Service Failed or was Denied', modName);
            didDownloadFail.setdidDownloadFail(true, 'Connection to Cloud Service failed or was denied by customer');
            return callback (err);
        }
        if (exists == false) {
            debug('%s Folder does not exist:' + cs_path, modName);
            //console.log("Folder does not exist:" + cs_path);
            didDownloadFail.setdidDownloadFail(true, 'Folder does not exist in your Cloud Service directory:' + cs_path);
            err = 'false';
            return callback (err);
        }
        // Setup Throttle/Queue
        RateLimitGetChildren = RateLimit(cs.getChildren, GetChildrenThrottle, cs);
        RateLimitDownload = RateLimit(cs.download, DownloadThrottle, cs);
        // Copy cs to fs
        getChildrenSemaphore = 0;
        downkloadSemaphore = 0;

        initialQueueWaitCounter = 0;
        isQueueEmpty(); // Monitor Queueu to know when download complete        
        
        addCsFs (cs_path,fsdirname + fs_path, (err, Callback) => {
            if (err) {
                //didDownloadFail.setdidDownloadFail(true, 'Add Download failed. Try again.');
                reportCSErrors(err);
            }
            return callback (err);  // ***** 1/11/2018 
        });
    });
//    });
 }
 
// Function: Async - Recursive - Copies the folder and  files from cs to fs 
// Defined as a "var" (an instance) so it can be called recursibly by itself
// Callback (err)
// Parameters:
//  cs_path - pathName of folder in cs where we will reading folder and files from
//  fs_path - pathName of folder in fs where we will write folder and files to
//  Callback - Expects (err) passed to callback
var addCsFs = function(cs_path, fs_path, callback) {

    var temp_fs_path = fs_path.replace(/'/g, "");   // Remove single quote from folder name
    fs_path = temp_fs_path;
    // If this folder is new, Make it
    fs.exists(fs_path, (exists) => {
        if (exists == false) {
            fs.mkdir(fs_path, function(err) { // "Make Directory" for this fs_path folder.
                if(err) {
                    //console.log("addCsFs,MakeDirectory Failed:", fs_path);
                    debug('%s addCsFs,MakeDirectory Failed:' + fs_path, modName);
                    return callback(err); 
                }
            });
        }
//        cs.getChildren(cs_path, function (err, children){
        getChildrenSemaphore = getChildrenSemaphore + 1;
        RateLimitGetChildren(cs_path, function (err, children) {
            // sometimes when this counter goes to 0, there still is more folders to process
            // I'll try to delay it 2 seconds before lettiing it go to zero
            if (getChildrenSemaphore === 1) {
                setTimeout(function() {
                    getChildrenSemaphore = getChildrenSemaphore - 1;

                }, 2000);
            } else {
                getChildrenSemaphore = getChildrenSemaphore - 1;
            }

            ;
//            console.log ('queueSize=',queueLength.getQueueLengthTotal());
            
            //console.log("getChildrenSemaphore=", getChildrenSemaphore);
            if(err) {
                //console.log("getChildren Failed:", cs_path);
                debug('%s getChildren Failed:' + err.message, modName);
                debug('%s getChildren Failed:' + cs_path, modName);
                return callback(err);
            }
            for (let child of children) {                    //  For Each Child (folder or file)
                if (child.folder == true) {                 //      If this is a Folder
                    addCsFs(cs_path + "/" + child.name, fs_path + "/" + child.name, callback);    // Call this function (Recusive), to copy files for this child folder
                } else {
                    if(isImageFile(child.name) === false) {continue}
                    // See if this file exists in fs
                    var temp_fs_path1 = fs_path + "/" + child.name;
                    temp_fs_path1 = temp_fs_path1.replace(/'/g, "");   // Remove single quote from folder name
                    fs.exists(temp_fs_path1, (exists) => {
                        if (exists == false) {
                            downkloadSemaphore = downkloadSemaphore + 1;
                            RateLimitDownload(cs_path + "/" + child.name, function (err, downStream) {
                                downkloadSemaphore = downkloadSemaphore - 1;
                                if (err) {
                                    debug('%s cs.download Error:' + err.message, modName);
                                    debug('%s cs.download Failed:' + cs_path + '/' +child.name, modName);
                                    //onsole.log("cs.download Failed:", cs_path + "/" + child.name);
                                    return callback(err);
                                } 
                                var temp_fs_path = fs_path.replace(/'/g, "");   // Remove single qiote (').
                                var temp_child_name = child.name.replace(/'/g, "");
                                writeFile_cs_fs (temp_fs_path, temp_child_name, downStream, function (err){
                                    if (err) return callback (err);
                                });
                            });
                        }
                    });
                }
            }  // end of for
 //           return callback(0);     // ***** 1/11/2018
        });
    });
    // console.log('finished processing copyCsFs');
}

// Function: Deletes everything from the fs relative to cs, then download from cs and saves in fs
var UpdateImages = function (cs_path, fs_path, callback) {
    bytesWrittenToFS= 0;
    updateGlobalErrors.setUpdateGlobalErrors(0,0,0,0);
    err_ECONNRESET = 0;
    err_ETIMEDOUT  = 0;
    err_FORBIDDEN = 0;
    err_UNKNOWN  = 0;
    //remove the last three characters (/js)
    var fsdirname = path.join(__dirname, '..'); // '..' means backup one folder
// Connect to CS and make sure there are the two folder there
    cs = serviceFunction.getService();
    connect_CS (cs_path, function(err, exists) {
        if(err) {
            //console.log("Connection to Cloud Service Failed or was Denied");
            debug('%s Connection to Cloud Service Failed or was Denied', modName);
            didDownloadFail.setdidDownloadFail(true, 'Connection to Cloud Service failed or was denied by customer');
            return callback (err);
        }
        if (exists == false) {
            //console.log("Folder does not exist:" + cs_path);
            debug('%s Folder does not exist:' + cs_path, modName);
            didDownloadFail.setdidDownloadFail(true, 'Folder does not exist in your Cloud Service directory:' + cs_path);
            err = 'false';
            return callback (err);
        }
        // Delete everything in the folder
        rmdirAsync (fsdirname + fs_path, (err, Callback) => {
            if (err) {
                debug('%s Could not be deleted - Fatal Error:' + fs_path, modName);
                //console.log(fs_path + ": Could not be deleted - Fatal Error");
                didDownloadFail.setdidDownloadFail(true, 'File System folder could not be deleted. Try again.');
                return callback (err);
                }            
            else {
                //console.log(fs_path + ": Deleted");
                }
            // Get MetaData of this beginning parent folder. so I can get the size to be copied
            RateLimitGetChildren = RateLimit(cs.getChildren, GetChildrenThrottle, cs);
            RateLimitDownload = RateLimit(cs.download, DownloadThrottle, cs);
            // Copy cs to fs
            getChildrenSemaphore = 0;
            downkloadSemaphore = 0;

            initialQueueWaitCounter = 0;
            isQueueEmpty(); // Monitor Queueu to know when download complete        
            
            copyCsFs (cs_path,fsdirname + fs_path, (err, Callback) => {
                if (err) {
                    //debug('%s UpdateImages Error:' + err.message, modName);
                    //debug('%s UpdateImages Failed:' + fs_path, modName);
                    //console.log(fs_path + ": Could not copy cs to fs - Fatal Error");
                    //didDownloadFail.setdidDownloadFail(true, 'Download failed. Try again.');
                    reportCSErrors(err);
                }            
            });
        });
    });
 }
 
// Function: Async - Recursive - Copies the folder and  files from cs to fs 
// Defined as a "var" (an instance) so it can be called recursibly by itself
// Callback (err)
// Parameters:
//  cs_path - pathName of folder in cs where we will reading folder and files from
//  fs_path - pathName of folder in fs where we will write folder and files to
//  Callback - Expects (err) passed to callback
var copyCsFs = function(cs_path, fs_path, callback) {

    fs_path = fs_path.replace(/'/g, "");   // Remove single quote from folder name
    fs.mkdir(fs_path, function(err) { // "Make Directory" for this fs_path folder.
        if(err) {
            //console.log("MakeDirectory Failed:", fs_path);
            debug('%s MakeDirectory Failed:' + fs_path, modName);
            return callback(err); 
        }
//        cs.getChildren(cs_path, function (err, children) { // Read cs Directory(Returns an array of child Folders and Files)
        getChildrenSemaphore = getChildrenSemaphore + 1;
        // The next line will put the "cs.getChildren" CloudRail function on a Queue for the Children Trottle delay time. 
        // When it times out and removed from queue, and executed, the returned to the next line with err and children parameters set.
        RateLimitGetChildren(cs_path, function (err, children) { // children is the returned parameter of the number if folder + files in cs_path
            // sometimes when this counter goes to 0, there still is more folders to process
            // I'll try to delay it 2 seconds before lettiing it go to zero
            if (getChildrenSemaphore === 1) {
                setTimeout(function() {
                    getChildrenSemaphore = getChildrenSemaphore - 1;
                }, 2000);
            } else {
                getChildrenSemaphore = getChildrenSemaphore - 1;
            }

//            console.log ('queueSize=',queueLength.getQueueLengthTotal());
            
            //console.log("getChildrenSemaphore=", getChildrenSemaphore);
            if(err) {
                //console.log("getChildren Failed:", cs_path);
                debug('%s getChildrens Error:' + err.message, modName);
                debug('%s getChildren Failed:' + cs_path, modName);
               return callback(err);
            }
       for (let child of children) {                   //  For Each Child (folder or file)
                if (child.folder == true) {                 //      If this is a Folder
                    copyCsFs(cs_path + "/" + child.name, fs_path + "/" + child.name, callback);    // Call this function (Recusive), to copy files for this child folder
                } else { 
                    if(isImageFile(child.name) === false) {continue}    // If this file extension is not one that is supported, continue For Loop
                    downkloadSemaphore = downkloadSemaphore + 1;
                    RateLimitDownload(cs_path + "/" + child.name, function (err, downStream) { //This is queued for Download Throttle time, then executed and retuned to the next line
                        downkloadSemaphore = downkloadSemaphore - 1;
                        if (err) {
                            debug('%s cs.download Error:' + err.message, modName);
                            debug('%s cs.download Failed:' + cs_path + "/" + child.name, modName);
                            // console.log("err=" + err + " err.message=" + err.message);
                            // Do not return cause more to process in for loop
                            // return callback(err);
                            reportCSErrors(err);
                        } else {
                            var temp_fs_path = fs_path.replace(/'/g, "");   // Remove single qiote (').
                            var temp_child_name = child.name.replace(/'/g, "");
                            writeFile_cs_fs (temp_fs_path, temp_child_name, downStream, function (err){
                                if (err) return callback (err); // If can't write to the file system, this is a fatal error
                            }); 
                        }
                    });
                }
            }  // end of for
// Don't return. Plenty may be on stack (recursive)            return callback(0); // ***** 1/11/2018 Fails if comment removed
        });
    });
}

var updateGlobalErrors = require(__dirname + '/updateGlobalErrors');

 function reportCSErrors(err) {
    if (err.code =="ECONNRESET"){
        err_ECONNRESET++;
        console.log("err_ECONNRESET:" + err_ECONNRESET + " err_ETIMEDOUT:" + err_ETIMEDOUT  + " err_FORBIDDEN:" + err_FORBIDDEN +  " err_UNKNOWN:" + err_UNKNOWN );
    } else {
        if (err.code =="ETIMEDOUT"){
            err_ETIMEDOUT++;
            console.log("err_ECONNRESET:" + err_ECONNRESET + " err_ETIMEDOUT:" + err_ETIMEDOUT  + " err_FORBIDDEN:" + err_FORBIDDEN +  " err_UNKNOWN:" + err_UNKNOWN );
        } else {
            if (err.message.slice(0,9) === "Forbidden"){
                err_FORBIDDEN++;
                console.log("err_ECONNRESET:" + err_ECONNRESET + " err_ETIMEDOUT:" + err_ETIMEDOUT + " err_FORBIDDEN:" + err_FORBIDDEN + " err_UNKNOWN:" + err_UNKNOWN);
            } else {
                err_UNKNOWN++;
                console.log ('err.code=', err.code);
                console.log ('err.message=', err.message);
                console.log("err_ECONNRESET:" + err_ECONNRESET + " err_ETIMEDOUT:" + err_ETIMEDOUT + " err_FORBIDDEN:" + err_FORBIDDEN + " err_UNKNOWN:" + err_UNKNOWN);
            }
        }
    }
    // Update global results
    updateGlobalErrors.setUpdateGlobalErrors(err_ECONNRESET, err_ETIMEDOUT, err_FORBIDDEN, err_UNKNOWN);            
 }

function writeFile_cs_fs(fspath, childname, downStream, callback) {
    //console.log("writeFile_cs_fs:", fspath + childname);
    // The way I know the complete download operation has completed is by sampling is the throttle queue us empty
    // and where is not more writing to the file system
    // If the file system things it is done writing, change it to true becasue we are ready to write another file
    if(isFileSystemActiveTF === false) {
       isFileSystemActiveTF = true;
        fileSystemPreviousSize = 1; // So no match on first atemp
        isFileSystemActive();
    }
    let fileStream = fs.createWriteStream(fspath + "/" + childname); // convert downSteam to filestream
    downStream.pipe(fileStream);    // Write file to file system
    downStream.on('end', function () {  // wait for it to complete
//    console.log ('queueSize=',queueLength.getQueueLengthTotal());
//    console.log("FileWrite:", childname);
    });
    downStream.on('data', function (chunk) {
        bytesWrittenToFS = bytesWrittenToFS + chunk.length; // track length written for a file
        return callback(0);  // 1/12/2018 Probably should put this here
    });
    // This is here incase any errors occur
    downStream.on('error', function (err) {
        if (err) {
            debug('%s downStream Failed:' + err, modName);
            //console.log("downStream Failed:", err);
            return callback(err);
        }
});

}   // End of function
// Function: Async - Recursive - Deletes the folder and all files and folder it contains 
// You can not delete a folder with files in it. 
// You can only delete a folder when there are no files in it.
// Defined as a "var" (an instance) so it can be called recursibly my itself
// Callback (err, )
var rmdirAsync = function(path, callback) {     // 
	fs.readdir(path, function(err, files) {     //  Read Directory(Returns an array of Folders and Files)
		if(err) {                               //      Callback: If Error (Caller passed bad path, file protected, netwok error)
 //           err = new Error("Force Error");            //          Testing to force an Error
			err = null;
            callback(err, []);                          //          Pass the error on to caller's callback
			return;                                     //
		}                                               //
		var wait = files.length,                        //  wait = Number of folders and files in this folder
			count = 0,                                  //  count used to determine when we have deleted the correct number of files
                                                        //      Callback Function  when all files deleted in 
			folderDone = function(err) {                /*      Function with a Function: folderDone (passing err */
			count++;                                    /*          increment counter by 1 */
			                                            /*              If we cleaned out all the files, continue */
			if( count >= wait || err) {                 /*              If (No more files to delete) OR (there was an error)*/
				fs.rmdir(path,callback);                /*                  Delete the last folder in child, and allow callback to return control to caller */
			}                                           /*                      */
		};                                              /*                      */
		                                                // Empty directory to bail early
		if(!wait) {                                     // If wait = 0 (given a folder with no files in it)
			folderDone();                               //  Call folderDone to Delete this Parent Folder
			return;
		}
		path = path.replace(/\/+$/,"");                 // Remove one or more trailing slash to keep from doubling up
		files.forEach(function(file) {                  // For Each Child (folder or file)
			var curPath = path + "/" + file;            //      assign curPath to filename path
			fs.lstat(curPath, function(err, stats) {    //      Get Status of folder or file
				if( err ) {                             //          Callback: If error occurred
					callback(err, []);                  //              Call Callback with error
					return;                             //
				}                                       //
				if( stats.isDirectory() ) {             //      If this is a Folder
					rmdirAsync(curPath, folderDone);    //        Call this function (Recusive). Can't delete folder with files in it
				} else {                                //      else          if at the end and need to delete Parent Folder)
					fs.unlink(curPath, folderDone);     //        Delete file (callback: Calls myself to determine
				}                                       //                    if at the end and need to delete Parent Folder)
			});                                         //      End fs.lstat Callback 
		});                                             //  End For
	});
}
// Funcion: Makes the first connection to the Cloud Service
// parammeter: cs_foder_path is a filepath that may or may not exists
// It does this by an "exists" function to determine if the Parent folder exists
// If there is a problem connecting to the cs, the error (err) with be returned in callback,
// Otherwise, exists will be returned (True = both folder exits; False if they both don't exists)
// Callback (err, exists)
function connect_CS (cs_folder_path, callback) {
    cs.exists(cs_folder_path, function (err, exists) {
        return callback (err, exists);
    });
}
// Function: Triverse the current "public/cs" directory and create "include.pug" files for each folder
// 
// var tempPath = path.join(__dirname, '../..'); // '..' means backup two folders to root
// tempPath = tempPath + '/routes/index';
// var indexPage = require(tempPath);  // ????? double periods ?????

function click_CreateJade () {
    //console.log ("click_CreateJade- Start");
    createIncludeJade (fs_root_dir_photos,  function (err) {
        if (err) {
            //console.log ("Failed to create photos Jade files: ", err);
            debug('%s Failed to create photos Jade files:' + err, modName);
            return(err);
        }
        createVideoJs (fs_root_dir_videos,  function (err) {
            if (err) {
                //console.log ("Failed to create videos Jade files: ", err);
                debug('%s Failed to create videos Jade files:' + err, modName);
                return(err);
            } else {
                // Done, goto Home page
                isDownloadComplete.setDownloadComplete(true);
                //debug('%s click_CreateJade - End', modName);
                //console.log ("click_CreateJade - End");
            }
        });
    });
}
// callback (err)
function createIncludeJade (fs_path, callback) {
    var fsdirname = path.join(__dirname, '..'); // '..' means backup one folder
    var record1 = 'a(href="';
    var record3 = '"  title="';
    var record31 = '';  // Title from matching .txt file
    var record32 = '" data-source="';
    var record33 = '';  // Data Source from matching .txt file
    var record34 = '")' + "\r\n";
    var record4 = '  img(src="';
    var record6 = '", width="75", height="75")' + "\r\n";
    // altnav format
    var altnav1 = "li: a.navigation(href='#', data-level='";
    var altnav2 = "";       // Path
    var altnav3 = "') ";
    var altnav4= "";        // Menu Name
    if( fs.existsSync(fsdirname + fs_path) ) {
        // create an empty rightsidenav.pug for 2 reasons
        //   1. It is needed at the tail end of all folders
        //   2. It can be oppened in Append mode later on, to add records one at a time
        var fd1 = fs.openSync(fsdirname + fs_path + "/" + "rightsidenav.pug", 'w+');
        err = fs.closeSync(fd1);
        // Open Jade File. It should not exixts
        var fd = fs.openSync(fsdirname + fs_path + "/" + "include.pug", 'w+');
        //console.log ("Open       :" + fs_path + "/" + "include.pug");
        fs.readdirSync(fsdirname + fs_path).forEach(function(file,index){
            var curPath = fs_path + "/" + file;
            if(fs.lstatSync(fsdirname + curPath).isDirectory()) { 
                createIncludeJade(curPath); // recurse if this is a folder
            } else {
                // write Jade record
                // Remove leading "/" from fs_path
                // If the file type is (.pug) then don't process it
                var nLength = file.length;       
                var nOffset = file.lastIndexOf(".");
                var filetype = file.slice(nOffset+1,nLength);
                if ((filetype != 'pug') && (filetype != 'txt') && (filetype != 'pdf')){
                    // Check is there is a .txt file with same name
                    var tempFileName = file.slice(0,nLength-(nLength-nOffset));
                    try {
                        if(fs.lstatSync(fsdirname + fs_path + "/" + tempFileName + ".txt").isFile()) { 
                            var contents = fs.readFileSync(fsdirname + fs_path + "/" + tempFileName + ".txt");
                            // Define to JSON type
                            var jsonContent = JSON.parse(contents);
                            // If contents start with http, use as is
                            if (jsonContent.DataSource == undefined)  {
                                    record31 = jsonContent.Title;
                                    record33 = "No Image Source";
                            } else {
                                if (jsonContent.DataSource.slice(0,4) == 'http') {
                                    record31 = jsonContent.Title;
                                    record33 = jsonContent.DataSource;
                                }
                                else {
                                    if (jsonContent.DataSource.lastIndexOf(".") == -1) {
                                        record31 = jsonContent.Title;
                                        record33 = "No Image Source";
                                    } else {
                                        // Get Value from JSON
                                        record31 = jsonContent.Title;
                                        // Get Value from JSON
                                        // The .txt, .pdf, and .jpg always are in the same folder
                                        // The DataSource just has the Filename
                                        //console.log("1002-FilePath=" + fs_path);
                                        //console.log("1002-DataSource=" + jsonContent.DataSource);
                                        //console.log("1002-tempFileName=" + tempFileName);
                                        nLength = jsonContent.DataSource.length;       
                                        nOffset = jsonContent.DataSource.lastIndexOf(".");
                                        filetype = jsonContent.DataSource.slice(nOffset+1,nLength);
                                        //console.log("1002-iletypfe=" + filetype);
                                        record33 = fs_path + "/" + tempFileName + "." + filetype;
                                        //console.log("1002-record33=" + record33);
                                    }
                                }
                            }
                        } else {
                            record31 = "No Image Source";
                            record33 = "No Image Source";
                        }
                    }
                    catch (e) {
                        // ... Do nothing if file does not exits
                        record31 = "No Image Source";
                        record33 = "No Image Source";
                    }                    
                    var fs_path1 = fs_path.slice(1, fs_path.length);
                    var buffer = record1 + fs_path1 + "/" + file + record3 + record31 + record32 + record33 + record34 + record4 + fs_path1 + "/" + file + record6;
                    path.normalize(buffer); // ??? 7/8/2017 ??? convert path to type of system running on
                    var lengthWriten = fs.writeSync(fd, buffer);
                    record31 = "";
                    //console.log ("WriteRecord:" + fs_path + "/" + file);
                } else {
                    // Delete all rightsidenav.pug files
                    if (file =="rightsidenav.pug") {
                        err = err;
//                      fs.unlinkSync(fsdirname + curPath);     //        Delete file (callback: Calls myself to determine
                   }
                }
            }
        }); // end For Loop
        // Close include.pug file
        var err = 0;
        err = fs.closeSync(fd);
        //console.log ("CloseFile  :" + fs_path + "/" + "include.pug");
        // At this point, I am at the end of a path, and can create the 2 Navigation Jade filess
        // I can write out the complete altnav because I have where I came from in the fs_path.
        // For the rightsidenav, I can write 1 record into the parent folder. 
        var currentPath = fs_path
        var tempBuffer = new Array();
        var tempMenu = new Array();
        var i = 0;
        var strTemp = '';
        // Open rightsidenav.pug in parent folder, and write one record 
        var tempParentPath = '';
        var tempChildMenu = '';
        var nLength = fs_path.length;       
        var nOffset = fs_path.lastIndexOf("/");
        tempParentPath = fs_path.slice(0,nOffset);   // start,end offset
        tempChildMenu = fs_path.slice(nOffset+1,nLength);
        var fd = fs.openSync(fsdirname + tempParentPath + "/" + "rightsidenav.pug", 'a');
        var buffer = altnav1 + fs_path + altnav3 + tempChildMenu + '\r\n';
        path.normalize(buffer); // ??? 7/8/2017 ??? convert path to type of system running on
        var lengthWriten = fs.writeSync(fd, buffer);
        err = fs.closeSync(fd);
        while (currentPath != fs_root_dir_images_cs) {
            // Save Record into buffer;
            var nLength = currentPath.length;       
            var nOffset = currentPath.lastIndexOf("/");
            strTemp = currentPath.slice(nOffset+1,nLength);   // start,end offset
            tempBuffer[i] = currentPath;
            tempMenu[i] = strTemp;
            i++
            // stripe this last folder offline
            strTemp = currentPath.slice(0,nOffset);   // start,end offset
            currentPath = strTemp;
            //lastIndexOf() Returns the position of the last found occurrence of a specified value in a string
        }
        if (i) {
            // Wrire out buffer in reverse order
            var fd = fs.openSync(fsdirname + fs_path + "/" + "altnav.pug", 'w+');
            while (i != 0) {
                i--;
                //var temp_fs_path = encodeURI(tempBuffer[i]);
                var buffer = altnav1 + tempBuffer[i] + altnav3 + tempMenu[i] + '\r\n';
                path.normalize(buffer); // ??? 7/8/2017 ??? convert path to type of system running on
                var lengthWriten = fs.writeSync(fd, buffer);
            }
            err = fs.closeSync(fd);
            if ((fs_path == fs_root_dir_photos) || (fs_path == fs_root_dir_videos)){
                return callback(err);
            }
        }
    } else {
        // fs_path does NOT exits
        didDownloadFail.setdidDownloadFail(true, 'myWebsite/Photos or myWebsite/Videos folder does not exist in your Cloud Service directory. You need to fix it and Download again.');
        debug('%s createIncludeJade:fs_path does NOT exits', modName);
        //console.log('createIncludeJade:fs_path does NOT exits');
        err = 'False';
        return callback(err);
    }
}
function createVideoJs (fs_path, callback) {
    var fsdirname = path.join(__dirname, '..'); // '..' means backup one folder
    // jPlayer jPlayerList Add
    var record1 = 'var myPlaylist = new jPlayerPlaylist({'+ '\r\n';
    var record2 = 'jPlayer: "#jquery_jplayer_1",' + '\r\n';
    var record3 = 'cssSelectorAncestor: "#jp_container_1"' + '\r\n';
    var record4 = '});' + '\r\n';

    var record5 = 'myPlaylist.add({' + '\r\n';
    
    var record6 = 'title: "';
    var record7 = '';   // Filename for Title
    var record8 = '",' + '\r\n';
    
    var record9 = 'free:true,' + '\r\n';

    var record10 = 'm4v: "';
    var record11 = '';  //Path and filename
    var record12 = '",' + '\r\n';

    var record13 = 'poster: "';
    var record14 = '';  // Path and filename without extension
    var record15 = '.png"' + '\r\n';

    var record16 = '});' + '\r\n';


    // altnav 
    var altnav1 = "li: a.navigation(href='#', data-level='";
    var altnav2 = "";       // Path
    var altnav3 = "') ";
    var altnav4= "";        // Menu Name
    if( fs.existsSync(fsdirname + fs_path) ) {
        var fd1 = fs.openSync(fsdirname + fs_path + "/" + "rightsidenav.pug", 'w+');
        err = fs.closeSync(fd1);
        // Open add_video.js file. It should not exixts
        var fd = fs.openSync(fsdirname + fs_path + "/" + "add_video.js", 'w+');
        var add_video_header_written = false;
        //console.log ("Open       :" + fs_path + "/" + "add_video.js");
        fs.readdirSync(fsdirname + fs_path).forEach(function(file,index){
            var curPath = fs_path + "/" + file;
            if(fs.lstatSync(fsdirname + curPath).isDirectory()) { // recurse
                createVideoJs(curPath);
            } else {
                var nLength = file.length;       
                var nOffset = file.lastIndexOf(".");
                var filetype = file.slice(nOffset+1,nLength);
                if (filetype == 'm4v'){
                    if (add_video_header_written == false){
                        add_video_header_written = true;
                        var lengthHeaderWritten = fs.writeSync(fd, record1 + record2 + record3 + record4);
                    }
                    var tempFilename = file.slice(0, file.length-4);
                    var fs_path1 = fs_path.slice(1, fs_path.length);
                    var buffer = record5 + record6 + tempFilename + record8 + record9 + record10 + fs_path1 + "/" + 
                        file + record12 + record13 + fs_path1 + "/" + tempFilename + record15 + record16;
                    path.normalize(buffer); // ??? 7/8/2017 ??? convert path to type of system running on
                    var lengthWriten = fs.writeSync(fd, buffer);
                    //console.log ("WriteRecord:" + fs_path + "/" + file);
                }
            }
        }); // end For Loop
        // Close include.pug file
        var err = 0;
        err = fs.closeSync(fd);
        //console.log ("CloseFile  :" + fs_path + "/" + "add_video.js");
        // At this point, I am at the end of a path, and can create the 2 Navigation Jade filess
        // I can write out the complete altnav because I have where I came from in the fs_path.
        // For the rightsidenav, I can write 1 record into the parent folder. 
        var currentPath = fs_path
        var tempBuffer = new Array();
        var tempMenu = new Array();
        var i = 0;
        var strTemp = '';
        // Open rightsidenav.pug in parent folder, and write one record 
        var tempParentPath = '';
        var tempChildMenu = '';
        var nLength = fs_path.length;       
        var nOffset = fs_path.lastIndexOf("/");
        tempParentPath = fs_path.slice(0,nOffset);   // start,end offset
        tempChildMenu = fs_path.slice(nOffset+1,nLength);
        var fd = fs.openSync(fsdirname + tempParentPath + "/" + "rightsidenav.pug", 'a');
        
       // var temp_fs_path = encodeURI(fs_path);

        var buffer = altnav1 + fs_path + altnav3 + tempChildMenu + '\r\n';
        path.normalize(buffer); // ??? 7/8/2017 ??? convert path to type of system running on
        var lengthWriten = fs.writeSync(fd, buffer);
        err = fs.closeSync(fd);
        while (currentPath != fs_root_dir_images_cs) {
            // Save Record into buffer;
            var nLength = currentPath.length;       
            var nOffset = currentPath.lastIndexOf("/");
            strTemp = currentPath.slice(nOffset+1,nLength);   // start,end offset
            tempBuffer[i] = currentPath;
            tempMenu[i] = strTemp;
            i++
            // stripe this last folder offline
            strTemp = currentPath.slice(0,nOffset);   // start,end offset
            currentPath = strTemp;
            //lastIndexOf() Returns the position of the last found occurrence of a specified value in a string
        }
        if (i) {
            // Wrire out buffer in reverse order
            var fd = fs.openSync(fsdirname + fs_path + "/" + "altnav.pug", 'w+');
            while (i != 0) {
                i--;
                //var temp_fs_path = encodeURI(tempBuffer[i]);
                var buffer = altnav1 + tempBuffer[i] + altnav3 + tempMenu[i] + '\r\n';
                path.normalize(buffer); // ??? 7/8/2017 ??? convert path to type of system running on
                var lengthWriten = fs.writeSync(fd, buffer);
            }
            err = fs.closeSync(fd);
            if ((fs_path == fs_root_dir_photos) || (fs_path == fs_root_dir_videos)){
                return callback(err);
            }
        }
    } else {
        // fs_path does NOT exits
        //console.log ('createIncludeJade:fs_path does NOT exits');
        debug('%s createVideoJs:fs_path does NOT exits', modName);
        didDownloadFail.setdidDownloadFail(true, 'myWebsite/Photos or myWebsite/Videos folder does not exist in your Cloud Service directory.  You need to fix it and Download again.');
        err = 'False';
        return callback(err);
    }
}
debug('%s End', modName);
//console.log('End download_cs.js');

