
var downloadComplete = true;
var SocketInUse= false;
var downloadTime;

exports.setDownloadComplete = function setDownloadComplete (complete) {
    downloadComplete = complete;
};
exports.getDownloadComplete = function getDownloadComplete () {
    return (downloadComplete);
};
exports.setSocketInUse = function setSocketInUse (complete) {
    SocketInUse = complete;
};
exports.getSocketInUse = function getSocketInUse () {
    return (SocketInUse);
};
exports.setStartTime = function setStartTime (startTime) {
    downloadTime = startTime;
};
exports.getStartTime = function getStartTime () {
    return (downloadTime);
};

