import {Http, Headers, RequestOptions, Response} from "@angular/http";
import objectToParams from "../utils/object.to.params";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Injectable} from "@angular/core";
import {BaseModel} from "../models/base.model";

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
    public abstract initModel(data: any): BaseModel;

    /**
     * Returns the base endpoint url for this service.
     */
    public abstract endPointUrl(): string;

    /**
     * Angular http library
     */
    public http: Http;

    /**
     * The number of items to show per page.
     * @type {number}
     */
    public perPage: number = 20;

    /**
     * Current page index (perPage times the current offset)
     *
     * @type {number}
     */
    public page: number = 1;

    /**
     * The expandable relationships.
     *
     * @type {Array}
     */
    public expand: Array<string> = [];

    /**
     * The fields to select
     *
     * @type {Array}
     */
    public fields: Array<string> = [];

    /**
     * The filters to apply on the search.
     *
     * @type {Array}
     */
    public filters: Array<{name: string, value: string, operator?: string}> = [];

    /**
     *
     * @type {Array}
     */
    public sort: Array<{key: string, direction: string}> = [];

    /**
     * Parameters that are allowed by setParam and addParam
     * @type {Array}
     */
    public allowedParams: Array<string> = [
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
    public headers: {[key: string]: string} = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    constructor(http: Http) {
        this.http = http;
    }

    /**
     * Sets the headers for most requests.
     *
     * @returns {RequestOptions}
     * @private
     */
    public _headerOptions() {
        let headers = new Headers(this.headers);
        return new RequestOptions({ headers: headers });
    }

    /**
     * Appends headers for each request.
     *
     * @param id
     * @param value
     */
    public addHeader(id: string, value: string) {
        this.headers[id] = value;
        return this;
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
    public paramsToString() {
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
        let options = this._headerOptions();
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
        let options = this._headerOptions();

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
        return this.http.get(this.fetchEndPoint() + "/" + id + "?" + this.paramsToString(), this._headerOptions())
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
        let options = this._headerOptions();

        return this.http.delete(httpUrl, options);
    }

    /**
     * Fetches multiple items and returns as one object.
     */
    public fetchResult(): any {
        return this.http.get(this.endPointUrl() + "?" + this.paramsToString(), this._headerOptions())
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
    public fetchAll (id: any = null, payloadOnly = false) {

        let url = this.fetchEndPoint();
        if (id !== null) {
            url += `/${id}`;
        }
        url += "?" + this.paramsToString();

        return this.http.get(url, this._headerOptions())
            .map(res => {
                if (payloadOnly) {
                    return res.json().map((row: any) => {
                        return this.initModel(row);
                    });
                } else {
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
                }
            });
    }

    /**
     * Fetches all data from the server using multiple requests
     * (use sparingly, if using in every circumstance change server default or if results change frequency and are not stable)
     * 'pageSizeLimit' => [1] is a hacky workaround on server to fetch all results.
     */
    public fetchComplete() {
        return new Promise((resolve, reject) => {
            this.setParam('page', 1)
                .fetchAll()
                .subscribe(
                    (data: any) => {
                        let pageCount = Number(data.meta.pageCount);
                        if (pageCount < 2) {
                            resolve(data.payload);
                        } else {
                            let pagesUpdated = 1;
                            let combinedData: Array<any> = [];
                            combinedData.fill([], 0, pageCount - 1);
                            combinedData[0] = data.payload;
                            for (let i = 1; i < pageCount; i ++) {
                                this.setParam('page', i + 1)
                                    .fetchAll()
                                    .subscribe(
                                        (data: any) => {
                                            pagesUpdated++;
                                            combinedData[Number(data.meta.page) - 1] = data.payload;
                                            //We merge into one once all data is retrieved to ensure correct order.
                                            if (pagesUpdated === pageCount) {
                                                let flattenedData: Array<any> = [];
                                                combinedData.forEach((data) => {
                                                    flattenedData = flattenedData.concat(data);
                                                });
                                                resolve(flattenedData);
                                            }
                                        },
                                        (err) => {
                                            reject(err);
                                        }
                                    );
                            }
                        }
                    },
                    (err) => {
                        reject(err);
                    }
                )
        })
    }

}
