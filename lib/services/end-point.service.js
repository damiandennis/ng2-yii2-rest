"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require("@angular/http");
var object_to_params_1 = require("../utils/object.to.params");
require("rxjs/add/operator/map");
var core_1 = require("@angular/core");
var EndPointService = (function () {
    function EndPointService() {
        /**
         * The number of items to show per page.
         * @type {number}
         */
        this.perPage = 20;
        /**
         * Current page index (perPage times the current offset)
         *
         * @type {number}
         */
        this.page = 1;
        /**
         * The expandable relationships.
         *
         * @type {Array}
         */
        this.expand = [];
        /**
         * The fields to select
         *
         * @type {Array}
         */
        this.fields = [];
        /**
         * The filters to apply on the search.
         *
         * @type {Array}
         */
        this.filters = [];
        /**
         *
         * @type {Array}
         */
        this.sort = [];
        /**
         * Parameters that are allowed by setParam and addParam
         * @type {Array}
         */
        this.allowedParams = [
            "perPage",
            "page",
            "expand",
            "filters",
            "sort",
            "fields"
        ];
        /**
         * The headers to send one each request.
         * @type {Object}
         * @private
         */
        this.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
    }
    /**
     * Sets the headers for most requests.
     *
     * @returns {RequestOptions}
     * @private
     */
    EndPointService.prototype._headerOptions = function () {
        var headers = new http_1.Headers(this.headers);
        return new http_1.RequestOptions({ headers: headers });
    };
    /**
     * Appends headers for each request.
     *
     * @param id
     * @param value
     */
    EndPointService.prototype.addHeader = function (id, value) {
        this.headers[id] = value;
    };
    /**
     * Sets a single parameter.
     *
     * @param id
     * @param value
     * @returns {EndPointService}
     */
    EndPointService.prototype.setParam = function (id, value) {
        if (typeof this[id] === "undefined" || this.allowedParams.indexOf(id) === -1) {
            throw new Error("Invalid parameter \"" + id + "\" set on endpoint.");
        }
        this[id] = value;
        return this;
    };
    /**
     * Adds a parameter onto an existing parameter if its an array.
     * @param id
     * @param value
     * @returns {EndPointService}
     */
    EndPointService.prototype.addParam = function (id, value) {
        if (this[id] !== undefined && Array.isArray(this[id])) {
            value = this[id].concat(value);
        }
        this.setParam(id, value);
        return this;
    };
    /**
     * Sets a group of parameters.
     *
     * @param params
     * @returns {EndPointService}
     */
    EndPointService.prototype.setParams = function (params) {
        var _this = this;
        Object.keys(params).map(function (id) {
            _this.setParam(id, params[id]);
        });
        return this;
    };
    /**
     * Fetches the current filters.
     *
     * @returns {Array<{name: string, value: string, operator?: string}>}
     */
    EndPointService.prototype.getFilters = function () {
        return this.filters;
    };
    /**
     * Converts parameters set to a string that is to be sent to the server.
     *
     * @returns {string}
     */
    EndPointService.prototype.paramsToString = function () {
        var params = {
            "per-page": this.perPage,
            expand: this.expand.join(","),
            fields: this.fields.join(","),
            filters: this.filters.length > 0 ? this.filters : [],
            page: this.page,
            sort: this.sort.map(function (sort) {
                return (sort.direction === "DESC" ? "-" : "") + sort.key;
            }).join(",")
        };
        return object_to_params_1.default(params);
    };
    /**
     * Updates a single record.
     */
    EndPointService.prototype.updateOne = function (id, params) {
        var _this = this;
        var httpUrl = this.fetchEndPoint() + "/" + id;
        var body = JSON.stringify(params);
        var options = this._headerOptions();
        return this.http.patch(httpUrl, body, options)
            .map(function (res) {
            return _this.initModel(res.json());
        });
    };
    /**
     * Inserts a single record.
     */
    EndPointService.prototype.insertOne = function (params) {
        var _this = this;
        var httpUrl = this.fetchEndPoint();
        var body = JSON.stringify(params);
        var options = this._headerOptions();
        return this.http.post(httpUrl, body, options)
            .map(function (res) {
            return _this.initModel(res.json());
        });
    };
    /**
     * Fetches the endpoint url.
     *
     * @returns {string}
     */
    EndPointService.prototype.fetchEndPoint = function () {
        return this.endPointUrl();
    };
    /**
     * Fetches a single item.
     *
     * @param id
     * @returns {Observable<Response>}
     */
    EndPointService.prototype.fetchOne = function (id) {
        var _this = this;
        return this.http.get(this.fetchEndPoint() + "/" + id + "?" + this.paramsToString(), this._headerOptions())
            .map(function (res) {
            return _this.initModel(res.json());
        });
    };
    /**
     * Deletes a single item
     * @param id
     * @param field
     * @returns {Observable<Response>}
     */
    EndPointService.prototype.deleteOne = function (id, field) {
        if (field === void 0) { field = null; }
        var httpUrl = this.fetchEndPoint() + "/" + id;
        if (field) {
            httpUrl += "/" + field;
        }
        var options = this._headerOptions();
        return this.http.delete(httpUrl, options);
    };
    /**
     * Fetches multiple items and returns as one object.
     */
    EndPointService.prototype.fetchResult = function () {
        var _this = this;
        return this.http.get(this.endPointUrl() + "?" + this.paramsToString(), this._headerOptions())
            .map(function (res) {
            return {
                payload: res.json().map(function (row) {
                    return _this.initModel(row);
                })
            };
        });
    };
    /**
     * Fetches multiple items and separates them into pages.
     */
    EndPointService.prototype.fetchAll = function () {
        var _this = this;
        return this.http.get(this.fetchEndPoint() + "?" + this.paramsToString(), this._headerOptions())
            .map(function (res) {
            return {
                meta: {
                    page: res.headers.get("X-Pagination-Current-Page"),
                    pageCount: res.headers.get("X-Pagination-Page-Count"),
                    totalCount: res.headers.get("X-Pagination-Total-Count"),
                    perPage: res.headers.get("X-Pagination-Per-Page")
                },
                payload: res.json().map(function (row) {
                    return _this.initModel(row);
                })
            };
        });
    };
    EndPointService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], EndPointService);
    return EndPointService;
}());
exports.EndPointService = EndPointService;
//# sourceMappingURL=end-point.service.js.map