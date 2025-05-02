
var ServiceObject;
var ServiceFunction;

exports.set = function set (FunctionParm, ServiceParm) {
    ServiceFunction = FunctionParm;
    ServiceObject = ServiceParm;
};
exports.getService = function getService () {
    return (ServiceObject);
};
exports.getFunction = function getFunction () {
    return (ServiceFunction);
};
