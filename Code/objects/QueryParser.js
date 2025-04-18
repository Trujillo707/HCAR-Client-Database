import mysql from 'mysql2/promise';
// If using CloudSQL, they suggest using their connect for better security, I suppose
import {Connector} from '@google-cloud/cloud-sql-connector';

/**
 * @author Orlando Trujillo-Ortiz et al.
 * @version 2025-03-30
 * @desc This class holds a mySQL2 database connection and executes queries.
 * It is implemented using the Singleton creation pattern, so although it
 * seems like programmers are making new instances, they are actually just
 * getting the same one. Unfortunately, JavaScript does not allow private
 * constructors so please keep this in mind!
 *
 * **WARNING:** You **must** utilize the QueryParserBuilder to get an instance!
 *
 * **IMPORTANT:** If you encounter behavior that mutates the state of QueryParser,
 * please report it immediately for an ASAP bugfix;
 *
 * @example Getting an instance of the singleton and using it
 * let myQueryParser = new QueryParserBuilder().build();
 * let results = myQueryParser.getAllClients(staffID);
 */
export default class QueryParser{
    /**
     * @type {QueryParser}
     */
    static #instance;
    /** @type {mysql.Pool} */
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
     * @desc Queries the database for a reduced subset of attributes for at most 10 clients at a time. No filters are
     *       applied, meaning all clients assigned to the given staff account will appear in the results in no
     *       particular order.
     * @param {number} acctID Account ID for the current logged-in staff
     * @param {number} offset Page offset for results, in multiples of 10 (e.g. offset = 1 --> Clients 11-20)
     */
    async getAllClients(acctID, offset = 0) {
        if (acctID == null){
            return {"Error": "Invalid Authentication"};
        }

        // NOTE: If HCAR ever expands to hold more than 1000 clients in the database, just increase the offset limit!
        if (typeof offset !== "number" || offset >= 100){
            offset = 0;
        }else{
            offset = offset * 10;
        }

        let results = [];
        let clientIDs;

        const basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND staffID = ? ORDER BY Client.clientID LIMIT 10 OFFSET " + offset;

        try {
            const [rows] = await this.#pool.execute(basicDetailsStmt, [acctID]);
                if (rows.length > 0) {
                    results.push(rows);
                    clientIDs = rows.map(client => client.clientID);
                }else{
                    // no need to return an array of an empty array
                    return []
                }
            } catch (e) {
            console.log("failure getting Client demographics:" + e);
            return [];
        }
        const placeholders = clientIDs.map(() => '?').join(', ');
        const programListStmt = "SELECT PC.clientID, Program.name FROM Program JOIN HCAR.ProgramClient PC on Program.programID = PC.programID JOIN HCAR.StaffClient SC on PC.clientID = SC.clientID WHERE PC.clientID IN (" + placeholders + ") ORDER BY PC.clientID";

        try{
            const [rows] = await this.#pool.execute(programListStmt, clientIDs);
            results.push(rows);
        }catch (e) {
            console.log("failure getting Client's Program list: " + e);
            return [];
        }

        return results;
    }

    // TODO: there is space for one more filter!
    /**
     * @desc Queries the database for a reduced subset of attributes for at most 10 clients at a time, with applied
     *       filters. It is the caller's responsibility to parse the results.
     * @param {number} acctID Account ID for the current loggedin staff
     * @param {Object} filters Object containing the named parameters for filter options
     * @param {string} filters.firstName First Name
     * @param {string} filters.lastName Last Name
     * @param {string} filters.phoneNumber Phone Number
     * @param {Date} filters.dob Date of Birth
     * @param {string} filters.gender Gender
     * @param {string} filters.maritalStatus Marital Status
     * @param {string} filters.email Email
     * @param {string} filters.payee Payee
     * @param {string} filters.conservator Conservator
     * @param offset {number} Page offset for results, in multiples of 10 (e.g. offset = 1 --> Clients 11-20)
     * @returns {*[]} Array of Objects containing raw SQL column results for each client returned
     */
    async getAllFilteredClients(acctID,
                                filters = {
                                    firstName: "%", lastName: "%", phoneNumber: "%", dob: "%", gender: "%",
                                    maritalStatus: "%", email: "%", payee: "%", conservator: "%"
                                },
                                offset = 0) {

        if (acctID == null){
            return {"Error": "Invalid Authentication"};
        }

        // NOTE: If HCAR ever expands to hold more than 1000 clients in the database, just increase the offset limit!
        if (typeof offset !== "number" || offset >= 100){
            offset = 0;
        }else{
            offset = offset * 10;
        }

        // TODO: consider changing schema to make sure what cols can be null and which cannot
        //       filtering must nullcheck any searchable cols that may be null in the DB
        const basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND staffID = ? AND fName LIKE ? AND lName LIKE ? AND phoneNumber LIKE ? AND dateOfBirth LIKE ? AND gender LIKE ? AND maritalStatus LIKE ? AND ifnull(email, '') LIKE ? AND payee LIKE ? AND conservator LIKE ? LIMIT 10 OFFSET " + offset;
        /*
            Pardon the absurd data validation.
         */
        let values = [];
        values.push(acctID);
        values.push(typeof filters.firstName === "string" ? filters.firstName : "%");
        values.push(typeof filters.lastName === "string" ? filters.lastName : "%");
        values.push(typeof filters.phoneNumber === "string" ? filters.phoneNumber : "%");
        values.push(filters.dob instanceof Date ? filters.dob.toISOString().slice(0,10) : "%");
        values.push(typeof filters.gender === "string" ? filters.gender : "%");
        values.push(typeof filters.maritalStatus === "string" ? filters.maritalStatus : "%");
        values.push(typeof filters.email === "string" ? filters.email : "%");
        values.push(typeof filters.payee === "string" ? filters.payee : "%");
        values.push(typeof filters.conservator === "string" ? filters.conservator : "%");


        console.log(values)
        let results = [];
        let clientIDs;

        try{
            const [rows] = await this.#pool.execute(basicDetailsStmt, values);
            if (rows.length > 0){
                results.push(rows);
                clientIDs = rows.map(client => client.clientID);
            }
            else{
                // Dont bother getting programs
                return [];
            }
        }catch (e) {
            console.log("failure getting Client's details: " + e);
            return [];
        }

        const placeholders = clientIDs.map(() => '?').join(', ');
        const programListStmt = "SELECT PC.clientID, Program.name FROM Program JOIN HCAR.ProgramClient PC on Program.programID = PC.programID JOIN HCAR.StaffClient SC on PC.clientID = SC.clientID WHERE PC.clientID IN (" + placeholders + ") ORDER BY PC.clientID";

        try{
            const [rows] = await this.#pool.execute(programListStmt, clientIDs);
            results.push(rows);
        }catch (e) {
            console.log("failure getting Client's Program list: " + e);
            return [];
        }

        return results;
    }

    // Methods below are more related to the Instance's properties and should be used sparingly

    /**
     * Access the current connection pool. This should be used with caution.
     * @returns {mysql.Pool}
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
        return QueryParser.#instance !== undefined && QueryParser.#instance !== null;
    }

    /**
     * This will destruct the
     * @returns {Promise<void>} This function is asynchronous and should handle the promise
     */
    async destructor(){
        if (this.#pool){
            await this.#pool.end();
            this.#pool = null;
        }
        if(this.#connector){
            this.#connector.close();
            this.#connector = null;
        }
        QueryParser.#instance = null;
    }
}
