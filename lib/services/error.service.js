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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var ErrorService = /** @class */ (function () {
    function ErrorService(router) {
        this.router = router;
        this.loginRoute = '/login';
        this.errorRoute = '/500';
        this.forbiddenRoute = '/403';
        this.criticalMessage = 'There was a problem with server. Please try again later.';
        this.forbiddenMessage = 'Your request is lacking the required permissions.';
        this.unAuthorisedMessage = 'Please login and try again.';
        this.validationMessage = 'There were some validation issues with your request.';
    }
    /**
     * This handles critical errors responses from server.
     *
     * @param error
     */
    ErrorService.prototype.handleCriticalResponse = function (error) {
        alert(this.criticalMessage);
    };
    /**
     * This handles validations errors that were not caught client side.
     *
     * @param error
     */
    ErrorService.prototype.handleValidationResponse = function (error) {
        var messages = error.json().map(function (item) {
            return item.message;
        });
        alert(this.validationMessage + "\n\n \u2022 " + messages.join("\n \u2022 "));
    };
    /**
     * Handles unauthorized access.
     *
     * @param error
     */
    ErrorService.prototype.handleForbiddenResponse = function (error) {
        alert(this.forbiddenMessage);
    };
    /**
     * Handles when some is required to be logged in but has not passed the router.
     *
     * @param error
     */
    ErrorService.prototype.handleUnAuthorisedResponse = function (error) {
        alert(this.unAuthorisedMessage);
    };
    /**
     * Generic error response.
     *
     * @param error
     * @param useRouter
     * @param lastLocation
     */
    ErrorService.prototype.response = function (error, useRouter, lastLocation) {
        if (useRouter === void 0) { useRouter = false; }
        if (lastLocation === void 0) { lastLocation = null; }
        var queryParams = {};
        if (lastLocation) {
            queryParams.lastLocation = lastLocation;
        }
        if (useRouter) {
            if (error.status) {
                switch (error.status) {
                    case 422:
                        this.handleValidationResponse(error);
                        break;
                    case 401:
                        this.router.navigate([this.loginRoute], {
                            queryParams: queryParams
                        });
                        break;
                    case 403:
                        this.router.navigate([this.forbiddenRoute], {
                            skipLocationChange: true,
                            queryParams: queryParams
                        });
                        break;
                    case 500:
                        console.error(error);
                        this.router.navigate([this.errorRoute], {
                            skipLocationChange: true,
                            queryParams: queryParams
                        });
                        break;
                    default:
                        console.error(error);
                        break;
                }
            }
            else {
                console.error(error);
                this.router.navigate([this.errorRoute], {
                    skipLocationChange: true,
                    queryParams: queryParams
                });
            }
        }
        else {
            if (error.status) {
                switch (error.status) {
                    case 422:
                        this.handleValidationResponse(error);
                        break;
                    case 401:
                        this.handleUnAuthorisedResponse(error);
                        break;
                    case 403:
                        this.handleForbiddenResponse(error);
                        break;
                    default:
                    case 500:
                        this.handleCriticalResponse(error);
                        break;
                }
            }
            else {
                this.handleCriticalResponse(error);
            }
            console.error(error);
        }
    };
    ErrorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router])
    ], ErrorService);
    return ErrorService;
}());
exports.ErrorService = ErrorService;
//# sourceMappingURL=error.service.js.map