"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel = (function () {
    /**
     * @param {Object} data The data to map to the model.
     */
    function BaseModel(data) {
        var _this = this;
        if (data) {
            Object.keys(data).map(function (key) {
                _this[key] = data[key];
            });
        }
    }
    return BaseModel;
}());
exports.BaseModel = BaseModel;
//# sourceMappingURL=base.model.js.map