
var globalDownloadType;

exports.setType = function setType (getType) {
    globalDownloadType = getType;
};
exports.getType = function getType () {
    return (globalDownloadType);
};
