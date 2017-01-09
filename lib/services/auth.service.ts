import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import objectToParams from "../utils/object.to.params";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import "rxjs/add/operator/toPromise";
import {BaseModel} from "../models/base.model";
import {Observable} from "rxjs";
import {AuthRequestInterface} from "../interfaces/auth-request.interface";

@Injectable()
export abstract class AuthService {

    public http: Http;
    public session: Observable<BaseModel|boolean>;
    public user: BehaviorSubject<BaseModel|boolean> = new BehaviorSubject(null);

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
    protected abstract sessionParams(): {expand: Array<any>};

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
    public authenticate(username: string, password: string): Observable<Response> {
        let headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" });
        let options = new RequestOptions({ headers: headers });
        let body = this.authParams({
            username,
            password
        });

        // Fetch token from api.
        return this.http.post(this.authUrl(), objectToParams(body), options);
    };

    /**
    * Fetches the data for the user.
    *
    * @returns {Observable<BaseModel|boolean>}
    */
    public fetchSession(): Observable<BaseModel|boolean> {

        if (this.session) {
          return this.session;
        }

        let headers = new Headers({ "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let body = objectToParams(this.sessionParams());
        let userDetails =  this.http.get(this.sessionUrl() + "?" + body, options);

        this.session = userDetails
          .map((data: any) => {
            let user: BaseModel = null;
            let jsonData = data.json();

            // Logged in?
            if (jsonData.id !== undefined) {
              user = this.setIdentity(jsonData);
            } else {
              user = false;
              this.user.next(user);
            }

            return user;
          });

        return this.session;
    }

    /**
     * The data that was fetched from the server.
     * @param data
     */
    protected setIdentity(data: any) {
        let user = this.userModel(data);
        this.user.next(user);
        return user;
    }

    /**
     * Logs the current user out of the system.
     */
    public logOut(): void {
        this.user.next(false);
    }

}
