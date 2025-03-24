import mysql from 'mysql2/promise';
// TODO: If using CloudSQL, they suggest using their connect for better security, I suppose
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
 * WARNING: If you encounter behavior that mutates the state of QueryParser,
 * please report it immediately for an ASAP bugfix;
 *
 * @example Getting an instance of the singleton and using it
 * let foo = new QueryParser();
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
     * @returns {QueryParser} The Singleton instance of QueryParser
     */
    constructor() {
        if (!QueryParser.#instance){
            try{
                this.connect();
            }
            catch (error){
                // TODO: Consider making this error propagate elsewhere?
                console.log(error);
            }
            QueryParser.#instance = this;
        }

        return QueryParser.#instance;
    }

    /**
     * Initializes a database connection pool. Currently, it assumes a Google CloudSQL
     * database using their Node.js connector to ensure TLS 1.3 and whatnot. This function
     * is asynchronous. See resources here: https://github.com/GoogleCloudPlatform/cloud-sql-nodejs-connector#usage
     * @returns {Promise<void>} Unknown if this return will be used
     */
    async connect() {
        if (!this.#pool){
            this.#connector = new Connector();
            const clientOpts = await this.#connector.getOptions({
                instanceConnectionName: process.env.DB_INSTANCE,
                ipType: 'PUBLIC',
            });
            this.#pool = await mysql.createPool({
                ...clientOpts,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            });
        }
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
