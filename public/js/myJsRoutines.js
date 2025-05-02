var debug = require('debug')('MySite10');
const modName = 'myJsRoutines.js'  
debug('%s Start', modName);

const path = require("path");

var myJsRoutines = (function () {
  var fs = require('fs-extra');
  var dirNameS = path.join(__dirname, '..'); // '..' means backup one folder to public
  var dirNameD = path.join(__dirname, '../..'); // '..' means backup two folders to root
  return {
    processLevel: function (level) {
      var err;
      var tempLength = 0;
      var sourceBuffer = "";
      var destBuffer = "";
      // If first character of level is 'm', click was not from the main menu
      var tempString = level.charAt(0);
      if (tempString == 'm') {
        tempLength = level.length;
        level = level.slice(1, tempLength);
      }
      // validation
      if (!level) {
        return('level is missing or 0'); // bail out
      }
      tempLength = level.search("/images/cs/Videos");
      if (tempLength != -1) {
        // Process Videos
        sourceBuffer = dirNameS + level + '/' + 'add_video.js';
        destBuffer = dirNameD + '/public/js/add_video.js';
      } else {
        // Process Photos
        sourceBuffer = dirNameS + level + '/' + 'include.pug';
        destBuffer = dirNameD + '/views/includes/include.pug';
      }
      try {
        fs.copySync(sourceBuffer, destBuffer)
      } catch (err) {
        debug('%s catch1:' + sourceBuffer + ', ' + destBuffer + ';err=' + err, modName);
        console.error(err)
      }
      try {
        fs.copySync(dirNameS + level + '/' + 'altnav.pug', dirNameD + '/views/includes/altnav.pug')
      } catch (err) {
        debug('%s catch2:' + dirNameS + level + '/' + 'altnav.pug, ' + dirNameD + '/views/includes/altnav.pug;err=' + err, modName);
      }
      try {
        fs.copySync(dirNameS + level + '/' + 'rightsidenav.pug', dirNameD + '/views/includes/rightsidenav.pug')
      } catch (err) {
        debug('%s catch3:' + dirNameS + level + '/' + 'rightsidenav.pug, ' + dirNameD + '/views/includes/rightsidenav.pug;err=' + err, modName);
      }
      
      var result = 1 * 2;

      // could return result, but need callback if code reads from file/db
      return(err);
//      callback(err, result);
    }
  };
}()); // function executed so myJsRoutines is an object
debug('%s End', modName);
module.exports = myJsRoutines;
