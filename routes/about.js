var express = require('express');
var router = express.Router();
var isDownloadComplete = require('../public/js/isDownloadComplete');

/* GET About Page */
router.get('/', function(req, res, next) {
  if (isDownloadComplete.getDownloadComplete() === false) {
    res.render ('messages', {
        message:'This site is temporarily being Downloaded.',
        description:'Check back in a little while.'});
  } else {
    res.render('about',{ title: 'About Use'});
  }
});
module.exports = router;
