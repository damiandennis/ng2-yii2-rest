import { Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
export declare abstract class EndPointService {
    /**
     * The primary key name.
     */
    abstract primaryKey(): string;
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
    http: Http;
    /**
     * The number of items to show per page.
     * @type {number}
     */
    protected perPage: number;
    /**
     * Current page index (perPage times the current offset)
     *
     * @type {number}
     */
    protected page: number;
    /**
     * The expandable relationships.
     *
     * @type {Array}
     */
    protected expand: Array<string>;
    /**
     * The fields to select
     *
     * @type {Array}
     */
    protected fields: Array<string>;
    /**
     * The filters to apply on the search.
     *
     * @type {Array}
     */
    protected filters: Array<{
        name: string;
        value: string;
        operator?: string;
    }>;
    /**
     *
     * @type {Array}
     */
    protected sort: Array<{
        key: string;
        direction: string;
    }>;
    /**
     * Parameters that are allowed by setParam and addParam
     * @type {Array}
     */
    protected allowedParams: Array<string>;
    /**
     * The headers to send one each request.
     * @type {Object}
     * @private
     */
    protected headers: {
        [key: string]: string;
    };
    /**
     * Sets the headers for most requests.
     *
     * @returns {RequestOptions}
     * @private
     */
    protected _headerOptions(): RequestOptions;
    /**
     * Appends headers for each request.
     *
     * @param id
     * @param value
     */
    addHeader(id: string, value: string): void;
    /**
     * Sets a single parameter.
     *
     * @param id
     * @param value
     * @returns {EndPointService}
     */
    setParam(id: string, value: any): this;
    /**
     * Adds a parameter onto an existing parameter if its an array.
     * @param id
     * @param value
     * @returns {EndPointService}
     */
    addParam(id: string, value: any): this;
    /**
     * Sets a group of parameters.
     *
     * @param params
     * @returns {EndPointService}
     */
    setParams(params: any): this;
    /**
     * Fetches the current filters.
     *
     * @returns {Array<{name: string, value: string, operator?: string}>}
     */
    getFilters(): {
        name: string;
        value: string;
        operator?: string;
    }[];
    /**
     * Converts parameters set to a string that is to be sent to the server.
     *
     * @returns {string}
     */
    protected paramsToString(): string;
    /**
     * Updates a single record.
     */
    updateOne(id: number, params: any): any;
    /**
     * Inserts a single record.
     */
    insertOne(params: any): any;
    /**
     * Fetches the endpoint url.
     *
     * @returns {string}
     */
    protected fetchEndPoint(): string;
    /**
     * Fetches a single item.
     *
     * @param id
     * @returns {Observable<Response>}
     */
    fetchOne(id: number): Observable<void>;
    /**
     * Deletes a single item
     * @param id
     * @param field
     * @returns {Observable<Response>}
     */
    deleteOne(id: number, field?: string): Observable<Response>;
    /**
     * Fetches multiple items and returns as one object.
     */
    fetchResult(): any;
    /**
     * Fetches multiple items and separates them into pages.
     */
    fetchAll(): Observable<{
        meta: {
            page: string;
            pageCount: string;
            totalCount: string;
            perPage: string;
        };
        payload: any;
    }>;
}
