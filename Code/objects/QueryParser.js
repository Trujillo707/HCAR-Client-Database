/**
 * @author Orlando Trujillo-Ortiz et al.
 * @version 2025-03-21
 * @desc This class holds a mySQL2 database connection and executes queries.
 * It is implemented using the Singleton creation pattern, so although it
 * seems like programmers are making new instances, they are actually just
 * getting the same one. Unfortunately, JavaScript does not allow private
 * constructors so please keep this in mind!
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
    #db;

    /**
     * This is the "Constructor" for QueryParser. Save the returned instance and
     * use it as if it were a regular class instance!
     * @returns {QueryParser} The Singleton instance of QueryParser
     */
    constructor() {
        if (!QueryParser.#instance){
            this.#connect();
            QueryParser.#instance = this;
        }

        return QueryParser.#instance;
    }

    #connect() {
        this.#db = "TODO"        //TODO: db logic here
    }

}
