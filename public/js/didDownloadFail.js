var downloadFail = false;
var downloadMessage ='';

exports.getdidDownloadMessage = function getdidDownloadMessage () {
    return (downloadMessage);
};
exports.setdidDownloadFail = function setdidDownloadFail (complete, message) {
    downloadFail = complete;
    downloadMessage = message;
};
exports.getdidDownloadFail = function getdidDownloadFail () {
    return (downloadFail);
};

