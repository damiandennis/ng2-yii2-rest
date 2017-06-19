import { Router } from "@angular/router";
export declare class ErrorService {
    router: Router;
    loginRoute: string;
    errorRoute: string;
    forbiddenRoute: string;
    criticalMessage: string;
    forbiddenMessage: string;
    unAuthorisedMessage: string;
    validationMessage: string;
    constructor(router: Router);
    /**
     * This handles critical errors responses from server.
     *
     * @param error
     */
    handleCriticalResponse(error: any): void;
    /**
     * This handles validations errors that were not caught client side.
     *
     * @param error
     */
    handleValidationResponse(error: any): void;
    /**
     * Handles unauthorized access.
     *
     * @param error
     */
    handleForbiddenResponse(error: any): void;
    /**
     * Handles when some is required to be logged in but has not passed the router.
     *
     * @param error
     */
    handleUnAuthorisedResponse(error: any): void;
    /**
     * Generic error response.
     *
     * @param error
     * @param useRouter
     * @param lastLocation
     */
    response(error: any, useRouter?: boolean, lastLocation?: any): void;
}
