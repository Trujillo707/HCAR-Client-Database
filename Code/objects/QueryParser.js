import mysql from 'mysql2/promise';
// If using CloudSQL, they suggest using their connect for better security, I suppose
import {Connector} from '@google-cloud/cloud-sql-connector';

/**
 * @author Orlando Trujillo-Ortiz et al.
 * @version 2025-03-23
 * @desc This class holds a mySQL2 database connection and executes queries.
 * It is implemented using the Singleton creation pattern, so although it
 * seems like programmers are making new instances, they are actually just
 * getting the same one. Unfortunately, JavaScript does not allow private
 * constructors so please keep this in mind!
 *
 * **WARNING:** You **must** assume the database connection has not been established and call connect()
 *
 * **IMPORTANT:** If you encounter behavior that mutates the state of QueryParser,
 * please report it immediately for an ASAP bugfix;
 *
 * @example Getting an instance of the singleton and using it
 * let foo = new QueryParser();
 * foo.connect();
 * let results = foo.getAllClients(staffID);
 */
export default class QueryParser{
    /**
     * @type {QueryParser}
     */
    static #instance;
    #pool;
    #connector;

    /**
     * This is the "Constructor" for QueryParser. Save the returned instance and
     * use it as if it were a regular class instance!
     * @param {QueryParserBuilder} builder A QueryParserBuilder object, ideally you should never do this manually
     * @returns {QueryParser} The Singleton instance of QueryParser
     */
    constructor(builder) {
        if (!QueryParser.#instance){
            this.#pool = builder.pool;
            this.#connector = builder.connector;
            QueryParser.#instance = this;
        }

        return QueryParser.#instance;
    }


    /**
     * Access the current connection pool. This should be used with caution.
     * @returns {Pool}
     */
    getPool(){
        return this.#pool;
    }

    /**
     * Access the Google CloudSQL Connector object. This should be used with extreme caution.
     * @returns {Connector}
     */
    getGoogleConnector(){
        return this.#connector;
    }

    /**
     * Checks if an instance of QueryParser was ever created. This is only
     * really useful for cleanup activities.
     * @returns {boolean}
     */
    static hasInstance(){
        return QueryParser.#instance !== undefined;
    }
}
