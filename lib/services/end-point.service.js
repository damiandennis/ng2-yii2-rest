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
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
var object_to_params_1 = require("../utils/object.to.params");
require("rxjs/add/operator/map");
var core_1 = require("@angular/core");
var is_js_object_1 = require("../utils/is.js.object");
var _ = require("lodash");
var EndPointService = (function () {
    function EndPointService(http) {
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
        this.http = http;
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
        return this;
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
        var httpUrl = this.fetchEndPoint() + "/" + id + "?" + this.paramsToString();
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
        var httpUrl = this.fetchEndPoint() + "?" + this.paramsToString();
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
    EndPointService.prototype.fetchAll = function (id, payloadOnly) {
        var _this = this;
        if (id === void 0) { id = null; }
        if (payloadOnly === void 0) { payloadOnly = false; }
        var url = this.fetchEndPoint();
        if (id !== null) {
            url += "/" + id;
        }
        url += "?" + this.paramsToString();
        return this.http.get(url, this._headerOptions())
            .map(function (res) {
            if (payloadOnly) {
                return res.json().map(function (row) {
                    return _this.initModel(row);
                });
            }
            else {
                var data_1 = res.json();
                var meta = _(res.headers.toJSON())
                    .mapKeys(function (v, k) {
                    return (k.charAt(0).toLowerCase() + k.slice(1)).replace(/-/g, '');
                })
                    .mapValues(function (v) {
                    return v.length == 1 ? v.pop() : v;
                })
                    .assign({
                    page: res.headers.get("X-Pagination-Current-Page"),
                    pageCount: res.headers.get("X-Pagination-Page-Count"),
                    totalCount: res.headers.get("X-Pagination-Total-Count"),
                    perPage: res.headers.get("X-Pagination-Per-Page")
                })
                    .value();
                return {
                    meta: meta,
                    payload: is_js_object_1.default(data_1)
                        ? Object.keys(data_1).map(function (key) { return _this.initModel(data_1[key]); })
                        : data_1.map(function (row) { return _this.initModel(row); })
                };
            }
        });
    };
    /**
     * Fetches all data from the server using multiple requests
     * (use sparingly, if using in every circumstance change server default or if results change frequency and are not stable)
     * 'pageSizeLimit' => [1] is a hacky workaround on server to fetch all results.
     */
    EndPointService.prototype.fetchComplete = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.setParam('page', 1)
                .fetchAll()
                .subscribe(function (data) {
                var pageCount = Number(data.meta.pageCount);
                if (pageCount < 2) {
                    resolve(data.payload);
                }
                else {
                    var pagesUpdated_1 = 1;
                    var combinedData_1 = [];
                    combinedData_1.fill([], 0, pageCount - 1);
                    combinedData_1[0] = data.payload;
                    for (var i = 1; i < pageCount; i++) {
                        _this.setParam('page', i + 1)
                            .fetchAll()
                            .subscribe(function (data) {
                            pagesUpdated_1++;
                            combinedData_1[Number(data.meta.page) - 1] = data.payload;
                            //We merge into one once all data is retrieved to ensure correct order.
                            if (pagesUpdated_1 === pageCount) {
                                var flattenedData_1 = [];
                                combinedData_1.forEach(function (data) {
                                    flattenedData_1 = flattenedData_1.concat(data);
                                });
                                resolve(flattenedData_1);
                            }
                        }, function (err) {
                            reject(err);
                        });
                    }
                }
            }, function (err) {
                reject(err);
            });
        });
    };
    return EndPointService;
}());
EndPointService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], EndPointService);
exports.EndPointService = EndPointService;
//# sourceMappingURL=end-point.service.js.map