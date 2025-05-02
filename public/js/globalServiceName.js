
var gServiceName;
var ServiceNamePhotos;
var ServiceNameVideos;
var gGetChildrenThrottle;
var gDownloadThrottle;

exports.setPhotos = function setPhotos (param) {
    ServiceNamePhotos = param;
    gServiceName = param;
};
exports.getPhotos = function getPhotos () {
    return (ServiceNamePhotos);
};
exports.setVideos = function setVideos (param) {
    ServiceNameVideos = param;
    gServiceName = param;
};
exports.getVideos = function getVideos () {
    return (ServiceNameVideos);
};
exports.getServiceName = function getServiceName () {
    return (gServiceName);
};
exports.setGetChildrenThrottle = function setGetChildrenThrottle (param) {
    gGetChildrenThrottle = param;
};
exports.getGetChildrenThrottle = function getGetChildrenThrottle () {
    return (gGetChildrenThrottle);
};
exports.setDownloadThrottle = function setDownloadThrottle (param) {
    gDownloadThrottle = param;
};
exports.getDownloadThrottle = function getDownloadThrottle () {
    return (gDownloadThrottle);
};
