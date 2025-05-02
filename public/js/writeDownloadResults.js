/*****************************************************/
// Write Download Results to downloadResults.csv 
// domain_name
// date_time
// service
//      dropbox
//      onedrive
//      box
//      drive
// type - 
//      dapv - Download All Photos & Videos
//      dap - Download All Photos
//      dav - Download All Videos
//      dnpv - Download New Photos & Videos
//      dnp - Download New Photos
//      dnv - Download New Videos
// size_written
// duration
// errors       - total number of errors written
// econnreset   - Number of ECONNRESET errors
// etimeout     - Number of ETIMEOUT errors
// forbidden    - Number of FORBIDDEN errors
// unknown      - Number of UNKNOW errors

var debug = require('debug')('MySite10');
const modName = 'writeDownloadResults.js'  
debug('%s Start', modName);

var path = require("path");
var fs = require('fs');
var globalDownloadType = require(__dirname + '/globalDownloadType');
var globalServiceName = require(__dirname + '/globalServiceName');
var updateGlobalErrors = require(__dirname + '/updateGlobalErrors');
var writeDownloadResults = require(__dirname + '/writeDownloadResults');

exports.write = function write (endDate, downloadTime, bytesWrittenToFS, errors, callback) {
    var tempPath = path.join(__dirname, '../data/downloadResults.csv');
    var date_time;
    var service;
    var getChildren_Throttle;
    var download_Throttle;
    var type;
    var size_written;
    var duration;
//    var strErrors = "";
    var econnreset;
    var etimeout;
    var forbidden;
    var eunknown;
    
    date_time = getDateTime();
    service = globalServiceName.getServiceName();

    getChildren_Throttle = globalServiceName.getGetChildrenThrottle();
    download_Throttle = globalServiceName.getDownloadThrottle();

    type = globalDownloadType.getType();
    if (bytesWrittenToFS != "0") {
        size_written = bytesWrittenToFS.replace(/,/g, ""); 
    } else {
        size_written = bytesWrittenToFS; 
    }
    //var n = num.toFixed(2);
    duration = downloadTime.toFixed(3);
    //duration = downloadTime;
    econnreset = updateGlobalErrors.get_err_ECONNRESET();
    etimeout = updateGlobalErrors.get_err_ETIMEDOUT();
    forbidden = updateGlobalErrors.get_err_FORBIDDEN();
    eunknown = updateGlobalErrors.get_err_UNKNOWN();
    
    
    var fd = fs.openSync(tempPath, 'a');
    var writeData;
    var lengthWriten = fs.writeSync(fd, g_short_domain_name + ',' + date_time + ',' + service + ',' + getChildren_Throttle + 
        ',' + download_Throttle + ',' + type + ',' +  size_written + ',' + duration + ',' + 
        errors + ',' + econnreset + ',' + etimeout + ',' + forbidden + ',' + eunknown + '\r\n');
    var err = fs.closeSync(fd);
    if (err) {
        debug('%s fs.closeSync Error downloadResults.csv=' + err.message, modName);
    } else {
        // Write Results of Last Download to public/data/resultsOfLastDownload.json
        tempPath = path.join(__dirname, '../data/resultsOfLastDownload.json');
        var contents = fs.readFileSync(tempPath);
        var jsonContent = JSON.parse(contents);
        jsonContent.service = service;
        jsonContent.type = type;
        jsonContent.errors = errors.toString();
        lengthWriten = fs.writeFileSync(tempPath, JSON.stringify(jsonContent), null, 2); 
    }
    return callback(err);
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "/" + day + "/" + year + ' ' + hour + ":" + min + ":" + sec;
    //return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

exports.read = function read () {
    var tempPath = path.join(__dirname, '../data/resultsOfLastDownload.json');
    var contents = fs.readFileSync(tempPath);
    var jsonContent = JSON.parse(contents);
    // Get Value from JSON
    var service = jsonContent.service;
    var type = jsonContent.type;
    var errors = jsonContent.errors;
    return [service,type,errors];
}

debug('%s End', modName);

