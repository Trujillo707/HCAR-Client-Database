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
export default class QueryParser {
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
        if (!QueryParser.#instance) {
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
     * @returns {Promise<Object[]>} Array of Objects containing raw SQL column results for each client returned
     */
    async getAllClients(acctID, offset = 0) {
        if (acctID == null) {
            return {"Error": "Invalid Authentication"};
        }

        // NOTE: If HCAR ever expands to hold more than 1000 clients in the database, just increase the offset limit!
        if (typeof offset !== "number" || offset >= 100) {
            offset = 0;
        } else {
            offset = offset * 10;
        }

        let results = [];
        let clientIDs;

        const basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Account, Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND Account.accountID = ? AND StaffClient.staffID = Account.staffID ORDER BY Client.clientID LIMIT ?,10"; /*OFFSET " + offset; */

        try {
            const [rows] = await this.#pool.execute(basicDetailsStmt, [acctID, offset.toString()]);
            if (rows.length > 0) {
                results.push(rows);
                clientIDs = rows.map(client => client.clientID);
            } else {
                // no need to return an array of an empty array
                return []
            }
        } catch (e) {
            console.log("failure getting Client demographics:" + e);
            return [];
        }
        const placeholders = clientIDs.map(() => '?').join(', ');
        const programListStmt = "SELECT PC.clientID, Program.name FROM Program JOIN HCAR.ProgramClient PC on Program.programID = PC.programID WHERE PC.clientID IN (" + placeholders + ") ORDER BY PC.clientID";

        try {
            const [rows] = await this.#pool.execute(programListStmt, clientIDs);
            results.push(rows);
        } catch (e) {
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
     * @returns {Promise<Object[]>} Array of Objects containing raw SQL column results for each client returned
     */
    async getAllFilteredClients(acctID,
                                filters = {
                                    firstName: "%", lastName: "%", phoneNumber: "%", dob: "%", gender: "%",
                                    maritalStatus: "%", email: "%", payee: "%", conservator: "%"
                                },
                                offset = 0) {

        if (acctID == null) {
            return {"Error": "Invalid Authentication"};
        }

        // NOTE: If HCAR ever expands to hold more than 1000 clients in the database, just increase the offset limit!
        if (typeof offset !== "number" || offset >= 100) {
            offset = 0;
        } else {
            offset = offset * 10;
        }

        //  consider changing schema to make sure what cols can be null and which cannot
        //       filtering must nullcheck any searchable cols that may be null in the DB
        // const basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Account, Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND Account.accountID = ? AND StaffClient.staffID = Account.staffID AND fName LIKE ? AND lName LIKE ? AND phoneNumber LIKE ? AND dateOfBirth LIKE ? AND gender LIKE ? AND maritalStatus LIKE ? AND ifnull(email, '') LIKE ? AND payee LIKE ? AND conservator LIKE ? LIMIT 10 OFFSET " + offset;
        // const basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND staffID = ? AND fName LIKE ? AND lName LIKE ? AND phoneNumber LIKE ? AND dateOfBirth LIKE ? AND gender LIKE ? AND maritalStatus LIKE ? AND ifnull(email, '') LIKE ? AND payee LIKE ? AND conservator LIKE ? LIMIT 10 OFFSET " + offset;
        /*
            Pardon the absurd data validation.
         */
        let values = [];
        values.push(acctID);
        // values.push(filters.firstName !== "" ? filters.firstName : "%");
        // values.push(filters.lastName !== "" ? filters.lastName : "%");
        // values.push(filters.phoneNumber !== "" ? filters.phoneNumber : "%");
        // values.push(filters.dob instanceof Date ? filters.dob.toISOString().slice(0,10) : "%");
        // values.push(filters.gender !== "Other" ? filters.gender : "%"); // Change later
        // values.push(filters.maritalStatus !== "Other" ? filters.maritalStatus : "%");
        // values.push(filters.email !== "" ? filters.email : "%");
        // values.push(filters.payee !== "" ? filters.payee : "%");
        // values.push(filters.conservator !== "" ? filters.conservator : "%");

        // Build query with chosen filters
        let basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Account, Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND Account.accountID = ? AND StaffClient.staffID = Account.staffID";
        for (const key of Object.keys(filters)) {
            if (filters[key] !== "" && filters[key] !== "%") {
                // Handling date conversion from js to mysql FIX ME
                if (key === "dob") {
                    values.push(filters[key].toISOString().slice(0, 10));
                    basicDetailsStmt += ` AND dateOfBirth LIKE ?`;
                } else if (key === "gender" || key === "maritalStatus") {
                    values.push(filters[key]);
                    basicDetailsStmt += ` AND LOWER(${key}) = LOWER(?)`; // DB has "Male" instead of "male"
                } else {
                    values.push(`%${filters[key]}%`);
                    if (key === "firstName")
                        basicDetailsStmt += ` AND fName LIKE ?`;
                    else if (key === "lastName")
                        basicDetailsStmt += ` AND lName LIKE ?`;
                    else
                        basicDetailsStmt += ` AND ${key} LIKE ?`;
                }
            }
        }

        basicDetailsStmt += " LIMIT ?, 10";
        values.push(offset.toString());

        console.log(values)
        console.log("Query: ", basicDetailsStmt);

        let results = [];
        let clientIDs;

        try {
            const [rows] = await this.#pool.execute(basicDetailsStmt, values);
            if (rows.length > 0) {
                results.push(rows);
                clientIDs = rows.map(client => client.clientID);
            } else {
                // Dont bother getting programs
                return [];
            }
        } catch (e) {
            console.log("failure getting Client's details: " + e);
            return [];
        }

        const placeholders = clientIDs.map(() => '?').join(', ');
        const programListStmt = "SELECT PC.clientID, Program.name FROM Program JOIN HCAR.ProgramClient PC on Program.programID = PC.programID WHERE PC.clientID IN (" + placeholders + ") ORDER BY PC.clientID";

        try {
            const [rows] = await this.#pool.execute(programListStmt, clientIDs);
            results.push(rows);
        } catch (e) {
            console.log("failure getting Client's Program list: " + e);
            return [];
        }

        return results;
    }

    /**
     * Queries the database for detailed demographic information of a specific client.
     * @param {number} clientID The ID of the client whose demographics are being queried
     * @returns {Promise<Object>} An object containing the client's demographic details or an error message
     */
    async getClientDemographics(clientID) {
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        const demoStmt = "SELECT Client.clientID, fName, lName, email, address, addressType, city, state, zip, dateOfBirth, phoneNumber, " +
            "       phoneType, sex, gender, pronouns, greeting, nickname, maritalStatus, religPref, payee, preferredHospital, likes, " +
            "       dislikes, goals, hobbies, achievements, conservator, F.filename as profilePicture " +
            "FROM Client " +
            "JOIN HCAR.File F on Client.profilePicture = F.fileID " +
            "WHERE Client.clientID = ?"

        try {
            const [rows] = await this.#pool.execute(demoStmt, [clientID]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return {"Error": "Client not found"};
            }
        } catch (e) {
            console.log("Error: Failure getting Client's demographics" + e);
            return {"Error": "Failure getting Client's demographics"};
        }
    }

    /**
     * Queries the database for the client's insurance and medical preferences.
     * @param {number} clientID
     * @returns {Promise<{primaryInsurance: null, secondaryInsurance: null, pcp: null, primaryPhysician: null}|{Error: string}>}
     */
    async getInsuranceAndMedicalPreferences(clientID) {
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        let results = {
            primaryInsurance: null, secondaryInsurance: null,
            pcp: null, primaryPhysician: null
        };

        let primaryInsuranceStmt = "SELECT name, policyNumber FROM Insurance WHERE insuranceID = (SELECT Client.primaryInsurance FROM Client WHERE clientID = ?)";
        let secondaryInsuranceStmt = "SELECT name, policyNumber FROM Insurance WHERE insuranceID = (SELECT Client.secondaryInsurance FROM Client WHERE clientID = ?)";
        let pcpStmt = "SELECT name, phoneNumber, address FROM ContactInfo WHERE contactID = (SELECT Client.primaryCareProvider FROM Client WHERE clientID = ?)";
        let primaryPhysicianStmt = "SELECT name, phoneNumber, address FROM ContactInfo WHERE contactID = (SELECT Client.primaryPhysician FROM Client WHERE clientID = ?)";

        try {
            const [primaryInsuranceRows, secondaryInsuranceRows, pcpRows, primaryPhysicianRows] = await Promise.all([
                this.#pool.execute(primaryInsuranceStmt, [clientID]),
                this.#pool.execute(secondaryInsuranceStmt, [clientID]),
                this.#pool.execute(pcpStmt, [clientID]),
                this.#pool.execute(primaryPhysicianStmt, [clientID])
            ]);

            results.primaryInsurance = primaryInsuranceRows;
            results.secondaryInsurance = secondaryInsuranceRows;
            results.pcp = pcpRows;
            results.primaryPhysician = primaryPhysicianRows;

            return results;
        } catch (e) {
            console.log("Error: Failure getting Client's insurance and medical preferences" + e);
            return {"Error": "Failure getting Client's insurance and medical preferences"};
        }
    }

    /**
     * Queries the database for the client's medication list.
     * @param {number} clientID
     * @returns {Promise<Object[]|{Error: string}>}
     */
    async getMedicationList(clientID){
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        let medicationStmt = "SELECT medicationID, name, prn, dosage, frequency, purpose, sideEffects, prescriber FROM Medication WHERE clientID = ? ORDER BY name";

        try {
            const [rows] = await this.#pool.execute(medicationStmt, [clientID]);
            return rows;
        } catch (e) {
            console.log("Error: Failure getting Client's medication list" + e);
            return {"Error": "Failure getting Client's medication list"};
        }
    }

    /**
     * Queries the database for the client's vaccination list (newest dates first).
     * @param clientID
     * @returns {Promise<Object[]|{Error: string}>}
     */
    async getVaccinationList(clientID){
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        let vaccinationStmt = "SELECT clientID, name, dateTaken FROM Vaccination WHERE clientID = ? ORDER BY dateTaken desc";

        try {
            const [rows] = await this.#pool.execute(vaccinationStmt, [clientID]);
            return rows;
        } catch (e) {
            console.log("Error: Failure getting Client's vaccination list" + e);
            return {"Error": "Failure getting Client's vaccination list"};
        }
    }

    /**
     * Queries the database for the Client's Case Note list (newest dates first).
     * @param clientID
     * @returns {Promise<Object[]|{Error: string}>}
     */
    async getCaseNoteList(clientID){
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        let caseNoteStmt = "SELECT Note.noteID, subject, dateCreated, CONCAT(fname, ' ', lname) as creator, name as programName FROM Note JOIN Staff ON Staff.staffID = Note.staffID JOIN Program ON Program.programID = Note.programID JOIN HCAR.NoteClient NC on Note.noteID = NC.noteID WHERE clientID = ? ORDER BY dateCreated DESC";

        try {
            const [rows] = await this.#pool.execute(caseNoteStmt, [clientID]);
            return rows;
        } catch (e) {
            console.log("Error: Failure getting Client's case note list:" + e);
            return {"Error": "Failure getting Client's case note list"};
        }
    }

    /**
     * Queries the database for a specific case note.
     * @param noteID
     * @returns {Promise<Object|{Error: string}>}
     */
    async getCaseNote(noteID){
        if (noteID == null || (typeof noteID != "number")) {
            return {"Error": "Invalid NoteID"};
        }

        let caseNoteStmt = "SELECT Note.noteID, subject, dateCreated, staffID, name as programName, dateModified, contactType, goal, narrative, goalProgress, nextSteps FROM Note JOIN HCAR.Program P on Note.programID = P.programID WHERE Note.noteID = ?";

        try {
            const [rows] = await this.#pool.execute(caseNoteStmt, [noteID]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return {"Error": "Note not found"};
            }
        } catch (e) {
            console.log("Error: Failure getting Client's case note:" + e);
            return {"Error": "Failure getting Client's case note"};
        }
    }

    /**
     * Queries the database for the Client's Support Staff list (newest dates first).
     * @param clientID
     * @returns {Promise<Object[]|{Error: string}>}
     */
    async getSupportStaffList(clientID){
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        let supportStaffStmt = "SELECT StaffClient.staffID, CONCAT(fname, ' ', lname) as staffName, title, dateAssigned, dateRemoved FROM StaffClient JOIN Staff ON Staff.staffID = StaffClient.staffID WHERE clientID = ? ORDER BY dateAssigned DESC";

        try {
            const [rows] = await this.#pool.execute(supportStaffStmt, [clientID]);
            return rows;
        } catch (e) {
            console.log("Error: Failure getting Client's support staff list:" + e);
            return {"Error": "Failure getting Client's support staff list"};
        }
    }

    // Methods below are more related to the Instance's properties and should be used sparingly

    /**
     * Access the current connection pool. This should be used with caution.
     * @returns {mysql.Pool}
     */
    getPool() {
        return this.#pool;
    }

    /**
     * Access the Google CloudSQL Connector object. This should be used with extreme caution.
     * @returns {Connector}
     */
    getGoogleConnector() {
        return this.#connector;
    }

    /**
     * Checks if an instance of QueryParser was ever created. This is only
     * really useful for cleanup activities.
     * @returns {boolean}
     */
    static hasInstance() {
        return QueryParser.#instance !== undefined && QueryParser.#instance !== null;
    }

    /**
     * This will destruct the
     * @returns {Promise<void>} This function is asynchronous and should handle the promise
     */
    async destructor() {
        if (this.#pool) {
            await this.#pool.end();
            this.#pool = null;
        }
        if (this.#connector) {
            this.#connector.close();
            this.#connector = null;
        }
        QueryParser.#instance = null;
    }
}
