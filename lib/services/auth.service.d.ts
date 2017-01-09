import { Http, Response } from "@angular/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/toPromise";
import { BaseModel } from "../models/base.model";
import { Observable } from "rxjs";
import { AuthRequestInterface } from "../interfaces/auth-request.interface";
export declare abstract class AuthService {
    http: Http;
    session: Observable<BaseModel | boolean>;
    user: BehaviorSubject<BaseModel | boolean>;
    /**
     * Returns a model that represents a user of the system (usually UserModel).
     *
     * @param data
     */
    protected abstract userModel(data: any): BaseModel;
    /**
     * Returns the session url.
     */
    protected abstract sessionUrl(): string;
    /**
     * Returns the session params to send at session url.
     */
    protected abstract sessionParams(): {
        expand: string;
    };
    /**
     * Returns the auth url.
     */
    protected abstract authUrl(): string;
    /**
     * Returns the payload to send to the auth url.
     *
     * @param params
     */
    protected abstract authParams(params: any): AuthRequestInterface;
    /**
     * Authenticates the user...
     *
     * @param username
     * @param password
     * @returns {Observable<Response>}
     */
    authenticate(username: string, password: string): Observable<Response>;
    /**
    * Fetches the data for the user.
    *
    * @returns {Observable<BaseModel|boolean>}
    */
    fetchSession(): Observable<BaseModel | boolean>;
    /**
     * The data that was fetched from the server.
     * @param data
     */
    protected setIdentity(data: any): BaseModel;
    /**
     * Logs the current user out of the system.
     */
    logOut(): void;
}
