"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_primative_1 = require("./is.primative");
/**
 * Converts an object to a parametrised string.
 * @param object
 * @returns {string}
 */
function objectToParams(object) {
    return Object.keys(object).map(function (value) {
        var objectValue = encodeURIComponent(is_primative_1.default(object[value]) ? object[value] : JSON.stringify(object[value]));
        return value + "=" + objectValue;
    }).join("&");
}
exports.default = objectToParams;
//# sourceMappingURL=object.to.params.js.map