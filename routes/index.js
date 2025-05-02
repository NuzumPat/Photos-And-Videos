var debug = require('debug')('MySite10');
const modName = 'router/index.js'  
debug('%s Start', modName);
var express = require('express');
var router = express.Router();
var isDownloadComplete = require('../public/js/isDownloadComplete');

router.get('/', function(req, res, next) {
  if (isDownloadComplete.getDownloadComplete() === false) {
    res.render ('messages', {
        message:'This site is temporarily being Downloaded.',
        description:'Check back in a little while.'});
  } else {
    res.render('index', { title: 'MySite10 Homepage' });
  }
});
debug('%s End', modName);
module.exports = router;
