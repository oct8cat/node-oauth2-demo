'use strict';

var util = module.exports = {}

util.uid = function (length) {
    var uid = ''
    for (var i = 0; i < length; i += 1) { uid += 'X' }
    return uid
}
