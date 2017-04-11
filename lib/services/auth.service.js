"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var object_to_params_1 = require("../utils/object.to.params");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/toPromise");
var AuthService = (function () {
    function AuthService() {
        this.user = new BehaviorSubject_1.BehaviorSubject(null);
        this._headers = { "Content-Type": "application/json", "Accept": "application/json" };
    }
    /**
     * Adds header
     *
     * @param key
     * @param value
     * @returns {AuthService}
     */
    AuthService.prototype.addHeader = function (key, value) {
        this._headers[key] = value;
        return this;
    };
    /**
     * Authenticates the user...
     *
     * @param username
     * @param password
     * @returns {Observable<Response>}
     */
    AuthService.prototype.authenticate = function (username, password) {
        var headers = new http_1.Headers({ "Content-Type": "application/x-www-form-urlencoded" });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = this.authParams({
            username: username,
            password: password
        });
        // Fetch token from api.
        return this.http.post(this.authUrl(), object_to_params_1.default(body), options);
    };
    ;
    /**
    * Fetches the data for the user.
    *
    * @returns {Observable<BaseModel|boolean>}
    */
    AuthService.prototype.fetchSession = function () {
        var _this = this;
        var headers = new http_1.Headers(this._headers);
        var options = new http_1.RequestOptions({ headers: headers });
        var body = object_to_params_1.default(this.sessionParams());
        var userDetails = this.http.get(this.sessionUrl() + "?" + body, options);
        return userDetails
            .map(function (data) {
            var user = null;
            var jsonData = data.json();
            // Logged in?
            if (jsonData.id !== undefined) {
                user = _this.setIdentity(jsonData);
            }
            else {
                user = false;
                _this.user.next(user);
            }
            return user;
        });
    };
    /**
     * The data that was fetched from the server.
     * @param data
     */
    AuthService.prototype.setIdentity = function (data) {
        var user = this.userModel(data);
        this.user.next(user);
        return user;
    };
    /**
     * Logs the current user out of the system.
     */
    AuthService.prototype.logOut = function () {
        this.user.next(false);
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map