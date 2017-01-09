import {Http, Headers, RequestOptions, Response} from "@angular/http";
import objectToParams from "../utils/object.to.params";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Injectable} from "@angular/core";

@Injectable()
export abstract class EndPointService {

    /**
     * The primary key name.
     */
    public abstract primaryKey(): string;

    /**
     * Initiates each instance of the model.
     *
     * @param data The data for the model.
     */
    protected abstract initModel(data: any): void;

    /**
     * Returns the base endpoint url for this service.
     */
    protected abstract endPointUrl(): string;

    /**
     * Angular http library
     */
    public http: Http;

    /**
     * The number of items to show per page.
     * @type {number}
     */
    protected perPage: number = 20;

    /**
     * Current page index (perPage times the current offset)
     *
     * @type {number}
     */
    protected page: number = 1;

    /**
     * The expandable relationships.
     *
     * @type {Array}
     */
    protected expand: Array<string> = [];

    /**
     * The fields to select
     *
     * @type {Array}
     */
    protected fields: Array<string> = [];

    /**
     * The filters to apply on the search.
     *
     * @type {Array}
     */
    protected filters: Array<{name: string, value: string, operator?: string}> = [];

    /**
     *
     * @type {Array}
     */
    protected sort: Array<{key: string, direction: string}> = [];

    /**
     * Parameters that are allowed by setParam and addParam
     * @type {Array}
     */
    protected allowedParams: Array<string> = [
        "perPage",
        "page",
        "expand",
        "filters",
        "sort",
        "fields"
    ];

    /**
     * Sets the headers for most requests.
     *
     * @returns {RequestOptions}
     * @private
     */
    protected _headerOptions() {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        return new RequestOptions({ headers: headers });
    }

    /**
     * Sets a single parameter.
     *
     * @param id
     * @param value
     * @returns {EndPointService}
     */
    public setParam(id: string, value: any) {
        if (typeof this[id] === "undefined" || this.allowedParams.indexOf(id) === -1) {
            throw new Error(`Invalid parameter "${id}" set on endpoint.`);
        }
        this[id] = value;
        return this;
    }

    /**
     * Adds a parameter onto an existing parameter if its an array.
     * @param id
     * @param value
     * @returns {EndPointService}
     */
    public addParam(id: string, value: any) {
        if (this[id] !== undefined && Array.isArray(this[id])) {
            value = this[id].concat(value);
        }
        this.setParam(id, value);
        return this;
    }

    /**
     * Sets a group of parameters.
     *
     * @param params
     * @returns {EndPointService}
     */
    public setParams(params: any) {
        Object.keys(params).map((id) => {
            this.setParam(id, params[id]);
        });
        return this;
    }

    /**
     * Fetches the current filters.
     *
     * @returns {Array<{name: string, value: string, operator?: string}>}
     */
    public getFilters() {
        return this.filters;
    }

    /**
     * Converts parameters set to a string that is to be sent to the server.
     *
     * @returns {string}
     */
    protected paramsToString() {
        let params = {
            "per-page": this.perPage,
            expand: this.expand.join(","),
            fields: this.fields.join(","),
            filters: this.filters.length > 0 ? this.filters : [],
            page: this.page,
            sort: this.sort.map((sort) => {
                return (sort.direction === "DESC" ? "-" : "") + sort.key;
            }).join(",")
        };
        return objectToParams(params);
    }

    /**
     * Updates a single record.
     */
    public updateOne(id: number, params: any): any {

        let httpUrl = this.fetchEndPoint() + "/" + id;
        let body = JSON.stringify(params);
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.patch(httpUrl, body, options)
            .map(res => {
                return this.initModel(res.json());
            });
    }

    /**
     * Inserts a single record.
     */
    public insertOne(params: any): any {

        let httpUrl = this.fetchEndPoint();
        let body = JSON.stringify(params);
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(httpUrl, body, options)
            .map(res => {
                return this.initModel(res.json());
            });
    }

    /**
     * Fetches the endpoint url.
     *
     * @returns {string}
     */
    protected fetchEndPoint() {
        return this.endPointUrl();
    }

    /**
     * Fetches a single item.
     *
     * @param id
     * @returns {Observable<Response>}
     */
    public fetchOne(id: number) {

        return this.http.get(this.fetchEndPoint() + "/" + id + "?" + this.paramsToString())
            .map(res => {
                return this.initModel(res.json());
            });
    }

    /**
     * Deletes a single item
     * @param id
     * @param field
     * @returns {Observable<Response>}
     */
    public deleteOne (id: number, field: string = null) {
        let httpUrl = this.fetchEndPoint() + "/" + id;
        if (field) {
            httpUrl += "/" + field;
        }
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(httpUrl, options);
    }

    /**
     * Fetches multiple items and returns as one object.
     */
    public fetchResult(): any {
        return this.http.get(this.endPointUrl() + "?" + this.paramsToString())
            .map(res => {
                return {
                    payload: res.json().map((row: any) => {
                        return this.initModel(row);
                    })
                };
            });
    }

    /**
     * Fetches multiple items and separates them into pages.
     */
    public fetchAll () {
        return this.http.get(this.fetchEndPoint() + "?" + this.paramsToString())
            .map(res => {
                return {
                    meta: {
                        page: res.headers.get("X-Pagination-Current-Page"),
                        pageCount: res.headers.get("X-Pagination-Page-Count"),
                        totalCount: res.headers.get("X-Pagination-Total-Count"),
                        perPage: res.headers.get("X-Pagination-Per-Page")
                    },
                    payload: res.json().map((row: any) => {
                        return this.initModel(row);
                    })
                };
            });
    }
}
