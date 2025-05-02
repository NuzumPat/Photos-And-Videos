
var queueLengthPath = 0;
var queueLengthFile = 0;

exports.setQueueLengthPath = function setQueueLengthPath (param) {
    queueLengthPath = param;
};
exports.getQueueLengthPath = function getQueueLengthPath () {
    return (queueLengthPath);
};

exports.setQueueLengthFile = function setQueueLengthFile (param) {
    queueLengthFile = param;
};
exports.getQueueLengthFile = function getQueueLengthFile () {
    return (queueLengthFile);
};

exports.getQueueLengthTotal = function getQueueLengthTotal () {
    return (queueLengthPath + queueLengthFile);
};
