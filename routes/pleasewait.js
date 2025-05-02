var debug = require('debug')('MySite10');
const modName = 'router/pleasewait.js'  
debug('%s Start1', modName);

var express = require('express');
var router = express.Router();
var serviceFunction = require('../public/js/serviceFunction');
var globalDownloadType = require('../public/js/globalDownloadType');
var csSelection = require('../public/js/download_cs');
var isDownloadComplete = require('../public/js/isDownloadComplete');

/* GET pleasewait Page */
router.get('/', function(req, res, next) {
  // debug('%s 15', modName);
  if (isDownloadComplete.getDownloadComplete() === false) {
    res.render('pleasewait', { title: 'Please Wait'});
    // debug('%s 18', modName);
    return;
  }
  // debug('%s 21', modName);
  var level;
  level = serviceFunction.getFunction();
  switch (level) {
    case '1': // Download Both Photos & Videos
      globalDownloadType.setType('dapv');   // Download All Photos & Videos
      csSelection.click_UpdateImages(function (err) { // call function to download all photos and videos from CS to FS
        if (err) {
          res.status(500);
          return res.send(err);
        }
        });
        break;
    case '2': // Download Photos
      globalDownloadType.setType('dap');   // Download All Photos
      csSelection.click_UpdatePhotos(function (err) { // call function to download all photos and videos from CS to FS
        if (err) {
          res.status(500);
          return res.send(err);
        }
        });
        break;
    case '3': //Download Videos
      globalDownloadType.setType('dav');   // Download All Videos
      csSelection.click_UpdateVideos(function (err) { // call function to download all photos and videos from CS to FS
        if (err) {
          res.status(500);
          return res.send(err);
        }
        });
        break;
    case '4': // Update Added Photos & Videos
      globalDownloadType.setType('dnpv');   // Download New Photos & Videos
      csSelection.click_UpdateAddedImages(function (err) { // call function to download all new photos and videos from CS to FS
        if (err) {
          res.status(500);
          return res.send(err);
        }
        });
        break;
    case '5':  // Update Added Photoes
      globalDownloadType.setType('dnp');   // Download New Photos
      csSelection.click_UpdateAddedPhotos(function (err) { // call function to download all new photos from CS to FS
        if (err) {
          res.status(500);
          return res.send(err);
        }
        });
        break;
    case '6':  // Update Added Videos
      globalDownloadType.setType('dnv');   // Download NewVideos
      csSelection.click_UpdateAddedVideos(function (err) { // call function to download all new videos from CS to FS
          if (err) {
            res.status(500);
            return res.send(err);
          }
        });
        break;
    case '7':  // Update Include Files
      csSelection.click_CreateJade(function (err) { // call function to create include naviation files
        if (err) {
          res.status(500);
          return res.send(err);
        }
        });
    default:
      return;
  }
  res.render('pleasewait', { title: 'Please Wait'});
  });
debug('%s End', modName);
module.exports = router;
