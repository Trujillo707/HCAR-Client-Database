import QueryParser from "./QueryParser.js";
import {Connector} from "@google-cloud/cloud-sql-connector";
import mysql from "mysql2/promise";

/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-30
 * @desc This is a Builder for QueryParser instances. However, due to QueryParser being a singleton, you still
 * ultimately receive the singleton instance upon the build() call on a QueryParserBuilder object.
 */
export default class QueryParserBuilder {
    /** @type {mysql.Pool} */
    #pool;
    /** @type {Connector} */
    #connector;

    /**
     * Create blank Builder instance.
     */
    constructor() {
    }

    /**
     * Initializes a database connection pool. Currently, it assumes a Google CloudSQL
     * database using their Node.js connector to ensure TLS 1.3 and whatnot. This function
     * is asynchronous. See resources here: https://github.com/GoogleCloudPlatform/cloud-sql-nodejs-connector#usage
     *
     *
     * @returns {Promise<void>} Unknown if this return will be used
     */
    async connect() {
        // If no QueryParsers have been made, then assume no connections have been made either!
        if (!QueryParser.hasInstance()){
            this.#connector = new Connector();

            // Error handling
            if(process.env.DB_INSTANCE == null){
                throw new Error("DB_INSTANCE env variable is undefined despite being required!");
            }
            if (process.env.DB_USER == null){
                throw new Error("DB_USER env variable is undefined despite being required!");
            }
            /*if (process.env.DB_PASS == null){
                throw new Error("DB_PASS env variable is undefined despite being required!");
            }*/
            if (process.env.DB_NAME == null){
                throw new Error("DB_NAME env variable is undefined despite being required!");
            }

            try{
                //console.log(process.env.DB_USER)
                const clientOpts = await this.#connector.getOptions({
                    instanceConnectionName: process.env.DB_INSTANCE,
                    authType: 'IAM',
                    ipType: "PUBLIC"
                });
                this.#pool = await mysql.createPool({
                    ...clientOpts,
                    user: process.env.DB_USER,
                    database: process.env.DB_NAME,
                });
            } catch (e) {
                throw e;
            }
        }
    }

    async build(){
        await this.connect();
        return new QueryParser(this);
    }

    /**
     * @returns {mysql.Pool}
     */
    get pool() {
        return this.#pool;
    }

    get connector() {
        return this.#connector;
    }
}