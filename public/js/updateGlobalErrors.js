
var  err_ECONNRESET = 0;
var  err_ETIMEDOUT = 0;
var  err_FORBIDDEN = 0;
var  err_UNKNOWN  = 0;

exports.setUpdateGlobalErrors = function setUpdateGlobalErrors (para1, para2, para3, para4) {
    err_ECONNRESET = para1;
    err_ETIMEDOUT = para2;
    err_FORBIDDEN = para3;
    err_UNKNOWN = para4;
    return
};
exports.getUpdateGlobalErrors = function getUpdateGlobalErrors () {
    return (err_ECONNRESET + err_ETIMEDOUT + err_FORBIDDEN + err_UNKNOWN);
};
exports.get_err_ECONNRESET = function get_err_ECONNRESET () {
    return (err_ECONNRESET);
};
exports.get_err_ETIMEDOUT = function get_err_ETIMEDOUT () {
    return (err_ETIMEDOUT);
};
exports.get_err_FORBIDDEN = function get_err_FORBIDDEN () {
    return (err_FORBIDDEN);
};
exports.get_err_UNKNOWN = function get_err_UNKNOWN () {
    return (err_UNKNOWN);
};
