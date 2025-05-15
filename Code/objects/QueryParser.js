import mysql from 'mysql2/promise';
import bcrypt from "bcryptjs";
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

        // NOTE: If changing the limit, make sure to change the limit in getAllFilteredClients() as well
        //       and change the limit math in resultsScript.js
        const limit = 15;

        // NOTE: If HCAR ever expands to hold more than 1000 clients in the database, just increase the offset limit!
        if (typeof offset !== "number" || offset >= 100 || offset < 0) {
            offset = 0;
        } else {
            offset = offset * limit;
        }

        let results = [];
        let clientIDs;

        /*const basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Account, Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND Account.accountID = ? AND StaffClient.staffID = Account.staffID ORDER BY Client.clientID LIMIT ?,10"; */

        /**
         * Kinda wacky but neat. This newer verison now
         * @type {string}
         */
        const basicDetailsStmt = "SELECT c.clientID, f.filename AS profilePictureFilename, c.fName, c.mName, c.lName, c.phoneNumber, c.email, DATE(c.dateOfBirth) AS 'dateOfBirth', c.pronouns, c.gender, c.pos " +
            "FROM Account a " +
            "LEFT JOIN StaffClient sc ON a.staffID = sc.staffID " +
            "INNER JOIN Client c ON ((a.admin = 1) OR (sc.clientID = c.clientID AND a.admin = 0)) " +
            "LEFT JOIN File f ON c.profilePicture = f.fileID " +
            "WHERE a.accountID = ? " +
            "ORDER BY c.clientID " +
            "LIMIT ?, ?"

        try {
            const [rows] = await this.#pool.execute(basicDetailsStmt, [acctID, offset.toString(), limit.toString()]);
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
     * @param {string} filters.program Program
     * @param {string} filters.email Email
     * @param {string} filters.payee Payee
     * @param {string} filters.conservator Conservator
     * @param offset {number} Page offset for results, in multiples of 10 (e.g. offset = 1 --> Clients 11-20)
     * @returns {Promise<Object[]>} Array of Objects containing raw SQL column results for each client returned
     */
    async getAllFilteredClients(acctID,
                                filters = {
                                    firstName: "%", lastName: "%", phoneNumber: "%", dob: "%", gender: "%",
                                    program: "%", email: "%", payee: "%", conservator: "%"
                                },
                                offset = 0) {

        const allowedFilters = ["firstName", "lastName", "phoneNumber", "dob", "gender",
            "program", "email", "payee", "conservator"];

        if (acctID == null) {
            return {"Error": "Invalid Authentication"};
        }

        const limit = 15;
        // NOTE: If HCAR ever expands to hold more than 1000 clients in the database, just increase the offset limit!
        if (typeof offset !== "number" || offset >= 100) {
            offset = 0;
        } else {
            offset = offset * limit;
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
        /*let basicDetailsStmt = "SELECT Client.clientID, filename as profilePictureFilename, fName, lName, phoneNumber, email, DATE(dateOfBirth) as 'dateOfBirth', pronouns, gender FROM Account, Client, StaffClient, File WHERE Client.clientID = StaffClient.clientID AND Client.profilePicture = File.fileID AND Account.accountID = ? AND StaffClient.staffID = Account.staffID";*/

        /**
         * See getAllClients() for a description of this query.
         */
        let basicDetailsStmt = "SELECT distinct c.clientID, f.filename AS profilePictureFilename, c.fName, c.mName, c.lName, c.phoneNumber, c.email, DATE(c.dateOfBirth) AS 'dateOfBirth', c.pronouns, c.gender, c.pos " +
            "FROM Account a " +
            "LEFT JOIN StaffClient sc ON a.staffID = sc.staffID " +
            "INNER JOIN Client c ON ((a.admin = 1) OR (sc.clientID = c.clientID AND a.admin = 0)) " +
            "LEFT JOIN File f ON c.profilePicture = f.fileID " +
            "LEFT JOIN ProgramClient pc ON pc.clientID = c.clientID " + 
            "LEFT JOIN Program p ON pc.programID = p.programID " + 
            "WHERE a.accountID = ? ";

        for (const key of Object.keys(filters)) {
            if (filters[key] !== "" && filters[key] !== "%" && allowedFilters.includes(key)) {
                // Handling date conversion from js to mysql FIX ME
                if (key === "dob") {
                    values.push(new Date(filters[key]).toISOString().slice(0, 10));
                    basicDetailsStmt += ` AND dateOfBirth LIKE ?`;
                } else if (key === "gender") {
                    values.push(filters[key]);
                    basicDetailsStmt += ` AND LOWER(${key}) = LOWER(?)`; // DB has "Male" instead of "male"
                } else if (key === 'program') {
                    values.push(Number(filters[key]));
                    basicDetailsStmt += ` AND pc.programID = ?`;
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

        basicDetailsStmt += " ORDER BY c.clientID";
        basicDetailsStmt += " LIMIT ?, ?";
        values.push(offset.toString());
        values.push(limit.toString());
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

        const demoStmt = "SELECT Client.clientID, fName, mName, lName, email, address, addressType, city, state, zip, dateOfBirth, phoneNumber, " +
            "       phoneType, sex, gender, pronouns, pos, greeting, nickname, maritalStatus, religPref, payee, preferredHospital, likes, " +
            "       dislikes, goals, hobbies, achievements, conservator, F.filename as profilePicture " +
            "FROM Client " +
            "LEFT JOIN HCAR.File F on Client.profilePicture = F.fileID " +
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
     * Queries the database for the programs a single client belongs to.
     * @param {number} clientID The ID of the client whose demographics are being queried
     * @returns {Promise<Object>} An object containing the client's demographic details or an error message
     */
    async getClientPrograms(clientID) {
        if (clientID == null) {
            return {"Error": "Invalid ClientID"};
        }

        if (typeof clientID != "number")
            clientID = Number(clientID);

        const demoStmt = "SELECT p.programID, p.name" +
            " FROM Program p JOIN HCAR.ProgramClient pc ON p.programID = pc.programID" + 
            " WHERE pc.clientID = ?";

        try {
            const [rows] = await this.#pool.execute(demoStmt, [clientID]);
            if (rows.length > 0) {
                return rows; 
            } else {
                return {"Error": "Client not found / Client belongs to no programs"};
            }
        } catch (e) {
            console.log("Error: Failure getting Client's programs" + e);
            return {"Error": "Failure getting Client's programs"};
        }
    }

    /**
     * Queries the database for the client's insurance and medical preferences.
     * @param {number} clientID
     * @returns {Promise<{primaryInsurance: Object, secondaryInsurance: Object, pcp: Object, primaryPhysician: Object}|{Error: string}>}
     * If data is found, each relevant key will contain an object with the relevant data. Otherwise, the key is undefined.
     * @example Return Value
     * {
     *     primaryInsurance: {
     *         "insuranceID": 2,
     *         "name": "Blue Cross Blue Shield PPO",
     *         "policyNumber": 222222222
     *     },
     *     secondaryInsurance: {
     *         "insuranceID": 6,
     *         "name": "Medicare Part A - Primary",
     *         "policyNumber": 666666666
     *     },
     *     pcp: {
     *         "contactID": 3,
     *         "name": "CareFirst Clinic",
     *         "phoneNumber": "555-2001",
     *         "address": "789 Care Blvd, Healthton"
     *     },
     *     primaryPhysician: {
     *         "contactID": 2,
     *         "name": "Dr. Bob Johnson",
     *         "phoneNumber": "555-1002",
     *         "address": "456 Wellness Ave, Medville"
     *     }
     * }
     */
    async getInsuranceAndMedicalPreferences(clientID) {
        if (clientID == null || (typeof clientID != "number")) {
            return {"Error": "Invalid ClientID"};
        }

        let results = {
            primaryInsurance: null, secondaryInsurance: null,
            pcp: null, primaryPhysician: null
        };

        let primaryInsuranceStmt = "SELECT insuranceID, name, policyNumber FROM Insurance WHERE insuranceID = (SELECT Client.primaryInsurance FROM Client WHERE clientID = ?)";
        let secondaryInsuranceStmt = "SELECT insuranceID, name, policyNumber FROM Insurance WHERE insuranceID = (SELECT Client.secondaryInsurance FROM Client WHERE clientID = ?)";
        let pcpStmt = "SELECT contactID, name, phoneNumber, address FROM ContactInfo WHERE contactID = (SELECT Client.primaryCareProvider FROM Client WHERE clientID = ?)";
        let primaryPhysicianStmt = "SELECT contactID, name, phoneNumber, address FROM ContactInfo WHERE contactID = (SELECT Client.primaryPhysician FROM Client WHERE clientID = ?)";

        try {
            const [[primaryInsuranceRows], [secondaryInsuranceRows], [pcpRows], [primaryPhysicianRows]] = await Promise.all([
                this.#pool.execute(primaryInsuranceStmt, [clientID]),
                this.#pool.execute(secondaryInsuranceStmt, [clientID]),
                this.#pool.execute(pcpStmt, [clientID]),
                this.#pool.execute(primaryPhysicianStmt, [clientID])
            ]);

            results.primaryInsurance = primaryInsuranceRows[0];
            results.secondaryInsurance = secondaryInsuranceRows[0];
            results.pcp = pcpRows[0];
            results.primaryPhysician = primaryPhysicianRows[0];

            return results;
        } catch (e) {
            console.log("Error: Failure getting Client's insurance and medical preferences" + e);
            return {"Error": "Failure getting Client's insurance and medical preferences"};
        }
    }

    #validateInput(username, password) {
        if (!username || !password) {
            return {"status": false, "message": {"Error": "Empty username or password"}};
        } else if (username.length > 32 || password.length > 32) {
            return {"status": false, "message": {"Error": "Input length exceeded"}};
        } else if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
            return {"status": false, "message": {"Error": "Username contains invalid characters"}};
        } else {
            return {"status": true, "message": {"Error": "Valid username/password input entered"}};
        }
    }

    async isAuthenticated(req, requiresAdmin = false) {
        try {
            const accountID = req.session.accountID;
            if (!accountID) {
                return {"Error": "Invalid authentication"};
            }
            let query = "SELECT username, staffID, disabled, admin FROM Account WHERE accountID = ?";
            const [Account] = await this.#pool.execute(query, [accountID]);
            if (Account[0].disabled === 1) {
                return {"Error": "Account has been disabled"};
            }
            if (requiresAdmin && Account[0].admin !== 1) {
                return {"Error": "Invalid permissions"};
            }
            return Account[0];
        } catch (err) {
            console.log(err);
            return {"Error": "Error authenticating"};
        }
    }

    async auth(req) {
        try {
            let validation = this.#validateInput(req.body.user, req.body.pass)
            if (!validation.status) {
                return validation.message;
            }

            let query = "SELECT * FROM Account WHERE username = ?";
            const [rows] = await this.#pool.execute(query, [req.body.user]);
            if (rows.length === 0) {
                return {"Error": "Incorrect username or password"};
            } //No user found
            else if (rows.length > 1) { //Should not happen
                return {"Error": "Incorrect username or password"};
            } else if (await bcrypt.compare(req.body.pass, rows[0].hash)) {
                if (rows[0].disabled === 1) {
                    return {"Error": "Account has been disabled"};
                }
                req.session.accountID = rows[0].accountID;
                return "Successful Login";
            } else {
                return {"Error": "Incorrect username or password"};
            }
        } catch (err) {
            return {"Error": "Error authenticating"};
        }
    };

    async createCaseNote(req) {
        const connection = await this.#pool.getConnection();
        try {
            const account = await this.isAuthenticated(req);
            if (account["Error"]) {
                return account["Error"];
            }
            const clientID = parseInt(req.body.clientID);
            if (!Number.isInteger(clientID)) {
                return {"Error": "Invalid Request"};
            }

            const staffID = account.staffID;
            await connection.beginTransaction();
            if (account.admin !== 1) {
                const staffClientQuery = "SELECT COUNT(*) FROM StaffClient WHERE staffID = ? AND clientID = ?";
                var [staffClient] = await connection.execute(staffClientQuery, [staffID, clientID]);
            }
            if (account.admin === 1 || staffClient[0]['COUNT(*)'] === 1) {
                await connection.execute("CALL CreateCaseNote(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                    staffID,
                    req.body.clientID,
                    req.body.contactType,
                    req.body.goal,
                    req.body.goalProgress,
                    req.body.narrative,
                    req.body.nextSteps,
                    req.body.subject,
                    req.body.dateOfSignoff,
                    req.body.dateOfEvent,
                    req.body.program
                ]);
                await connection.commit();
                return {"message": "Case note successfully created"};
            } else {
                await connection.rollback();
                return {"Error": "Invalid authentication"};
            }
        } catch (err) {
            await connection.rollback();
            console.log(err);
            return {"Error": "Error creating casenote"};
        }
    };

    async updateCaseNote(req) {
        const connection = await this.#pool.getConnection();
        let programID;
        try {
            const account = await this.isAuthenticated(req);
            if (account["Error"]) {
                return account["Error"];
            }
            const noteID = parseInt(req.body.noteID);
            const clientID = parseInt(req.body.clientID);
            if (!Number.isInteger(noteID) || !Number.isInteger(clientID)) {
                return {"Error": "Invalid Request"};
            }

            const staffID = account.staffID;
            await connection.beginTransaction();
            if (account.admin !== 1) {
                const staffClientQuery = "SELECT COUNT(*) FROM StaffClient WHERE staffID = ? AND clientID = ?";
                var [staffClient] = await connection.execute(staffClientQuery, [staffID, clientID]);
            }
            if (account.admin === 1 || staffClient[0]['COUNT(*)'] === 1) {

                // Get program name
                let programStmt = "SELECT programID FROM Program WHERE name = ?";
                try {
                    const [rows] = await connection.execute(programStmt, [req.body.program]);
                    if (rows.length === 0) 
                        return {"Error": "Could not find ID matching program name"};
                    
                    programID = rows[0].programID;
                } catch (e) {
                    console.log("Error: Failure getting program ID given program name" + e);
                    return {"Error": "Failure getting program ID given program name"};
                }

                await connection.execute("UPDATE Note SET contactType = ?, goal = ?, goalProgress = ?, narrative = ?, nextSteps = ?, subject = ?, dateModified = ?, dateOfEvent = ?, programID = ? WHERE noteID = ?", [
                    req.body.contactType,
                    req.body.goal,
                    req.body.goalProgress,
                    req.body.narrative,
                    req.body.nextSteps,
                    req.body.subject,
                    req.body.dateOfSignoff,
                    req.body.dateOfEvent,
                    programID,
                    noteID
                ]);
                await connection.commit();
                return {"message": "Case note successfully updated"};
            } else {
                await connection.rollback();
                return {"Error": "Invalid authentication"};
            }
        } catch (err) {
            await connection.rollback();
            console.log(err);
            return {"Error": "Error updating casenote"};
        }
    };

    async deleteCaseNote(req) {
        const connection = await this.#pool.getConnection();
        try {
            const account = await this.isAuthenticated(req);
            if (account["Error"]) {
                return account["Error"];
            }
            const noteID = parseInt(req.body.noteID);
            const clientID = parseInt(req.body.clientID);

            if (!Number.isInteger(clientID) || !Number.isInteger(noteID)) {
                return {"Error": "Invalid Request"};
            }

            const staffID = account.staffID;
            await connection.beginTransaction();
            if (account.admin !== 1) {
                const staffClientQuery = "SELECT COUNT(*) FROM StaffClient sc JOIN NoteClient nc ON sc.clientID=nc.clientID WHERE sc.staffID = ? AND nc.noteID = ? AND sc.clientID = ?;";
                var [staffClientNote] = await connection.execute(staffClientQuery, [staffID, noteID, clientID]);
            }
            console.log(staffClientNote[0]['COUNT(*)']);
            if (account.admin === 1 || staffClientNote[0]['COUNT(*)'] === 1) {
                var [deleteResults] = await connection.execute("CALL DeleteCaseNote(?, ?)", [
                    clientID,
                    noteID
                ]);
                await connection.commit();
                if (deleteResults.affectedRows === 0) {
                    await connection.rollback();
                    return {"Error": "Case note already deleted/does not exist"};
                } else {
                    return {"message": "Case note successfully deleted"};
                }
            } else {
                await connection.rollback();
                return {"Error": "Invalid deletion query"};
            }

        } catch (err) {
            await connection.rollback();
            return {"Error": "Error deleting casenote"};
        } finally {
            await connection.release();
        }
    };

    async createClient(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        await connection.beginTransaction();

        const createClientQuery = "INSERT INTO Client(fName, mName, lName, email, address, addressType, city, state, zip, dateOfBirth, phoneNumber, phoneType, sex, gender, pronouns, greeting, nickname, maritalStatus, religPref, payee, preferredHospital, likes, dislikes, goals, hobbies, achievements, conservator) VALUES(:fName, :mName, :lName, :email, :address, :addressType, :city, :state, :zip, :dateOfBirth, :phoneNumber, :phoneType, :sex, :gender, :pronouns, :greeting, :nickname, :maritalStatus, :religPref, :payee, :preferredHospital, :likes, :dislikes, :goals, :hobbies, :achievements, :conservator)";
        let [createClientResult] = await connection.execute(createClientQuery, 
          {
            fName: req.body.fName,
            mName: req.body.mName,
            lName: req.body.lName,
            email: req.body.email,
            address: req.body.address,
            addressType: req.body.addressType,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            phoneType: req.body.phoneType,
            sex: req.body.sex,
            gender: req.body.gender,
            pronouns: req.body.pronouns,
            greeting: req.body.greeting,
            nickname: req.body.nickname,
            maritalStatus: req.body.maritalStatus,
            religPref: req.body.religPref,
            payee: req.body.payee,
            preferredHospital: req.body.preferredHospital,
            //likes: req.body.likes,
            //dislikes: req.body.dislikes,
            //goals: req.body.goals,
            //hobbies: req.body.hobbies,
            //achievements: req.body.achievements,
            conservator: req.body.conservator
        });
        await connection.commit();
        return {"message": "Client successfully created"};
      }
      catch(err){
        await connection.rollback();
        return {"Error":"Error creating client"};
      }
      finally{
        await connection.release();
      }
    }

    async updateClient(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        const clientID = parseInt(req.body.clientID);
        if(!Number.isInteger(clientID)){
          return {"Error":"Invalid Request"};
        }
        await connection.beginTransaction();

        const updateClientQuery = `
        UPDATE Client
        SET fName             = :fName,
         mName             = :mName,
         lName             = :lName,
         email             = :email,
         address           = :address,
         addressType       = :addressType,
         city              = :city,
         state             = :state,
         zip               = :zip,
         dateOfBirth       = :dateOfBirth,
         phoneNumber       = :phoneNumber,
         phoneType         = :phoneType,
         sex               = :sex,
         gender            = :gender,
         pronouns          = :pronouns,
         greeting          = :greeting,
         nickname          = :nickname,
         maritalStatus     = :maritalStatus,
         religPref         = :religPref,
         payee             = :payee,
         preferredHospital = :preferredHospital,
         likes             = :likes,
         dislikes          = :dislikes,
         goals             = :goals,
         hobbies           = :hobbies,
         achievements      = :achievements,
         conservator       = :conservator
        WHERE clientID         = :clientID
        `;
        let [updateClientResult] = await connection.execute(updateClientQuery, 
          {
            clientID:         clientID,
            fName:            req.body.fName,
            mName:            req.body.mName,
            lName:            req.body.lName,
            email:            req.body.email,
            address:          req.body.address,
            addressType:      req.body.addressType,
            city:             req.body.city,
            state:            req.body.state,
            zip:              req.body.zip,
            dateOfBirth:      req.body.dateOfBirth,
            phoneNumber:      req.body.phoneNumber,
            phoneType:        req.body.phoneType,
            sex:              req.body.sex,
            gender:           req.body.gender,
            pronouns:         req.body.pronouns,
            greeting:         req.body.greeting,
            nickname:         req.body.nickname,
            maritalStatus:    req.body.maritalStatus,
            religPref:        req.body.religPref,
            payee:            req.body.payee,
            preferredHospital:req.body.preferredHospital,
            likes:            req.body.likes,
            dislikes:         req.body.dislikes,
            goals:            req.body.goals,
            hobbies:          req.body.hobbies,
            achievements:     req.body.achievements,
            conservator:      req.body.conservator
        });
        await connection.commit();
        return {"message": "Client successfully updated"};
      }
      catch(err){
        console.log(err);
        await connection.rollback();
        return {"Error":"Error updating client"};
      }
      finally{
        await connection.release();
      }
    }
    
    async deleteClient(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        const clientID = parseInt(req.body.clientID);
        if(!Number.isInteger(clientID)){
          return {"Error":"Invalid Request"};
        }
        await connection.beginTransaction();
        let [deleteResults] = await connection.execute("CALL DeleteClient(?)", [clientID]);
        await connection.commit();
        return {"message": "Client successfully deleted"};
      }
      catch(err){
        console.log(err);
        await connection.rollback();
        return {"Error":"Error deleting client"};
      }
      
      finally{
        await connection.release();
      }
    }

    async searchStaff(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        const fName = typeof req.body.fName === 'string' ? `%${req.body.fName}%` : '%%';
        const lName = typeof req.body.lName === 'string' ? `%${req.body.lName}%` : '%%';
        await connection.beginTransaction();
        let [staffResults] = await connection.execute("SELECT staffID, fName, mName, lName FROM Staff WHERE fName LIKE ? AND lName LIKE ?", [fName, lName]);
        await connection.commit();
        return staffResults;
      }
      catch(err){
        console.log(err);
        await connection.rollback();
        return {"Error":"Error retrieving Staff"};
      }
      finally{
        await connection.release();
      }
    }

    async createAccount(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        // Allow only A–Z, a–z, 0–9 for username
        const usernameValidation = /^[A-Za-z0-9]+$/;
        // Allow only letters for names and an empty string to be sent
        const nameValidation = /^[A-Za-z]+$/;
        const mNameValidation = /^[A-Za-z]*$/;

        if(this.#validateInput(req.body.username, req.body.password)["status"] === false || !usernameValidation.test(req.body.username) || !nameValidation.test(req.body.fName) || !mNameValidation.test(req.body.mName) || !nameValidation.test(req.body.lName)){
          return {"Error":"Invalid input"};
        }
        await connection.beginTransaction();
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        
        const accountQuery = "INSERT INTO Account(username, hash, admin, disabled) VALUES(?, ?, ?, ?)";
        const [accountResponse] = await connection.execute(accountQuery, [req.body.username, hash, 0, 0]);
        const accountID = accountResponse.insertId;
        
        const staffQuery = "INSERT INTO Staff (fName, mName, lName, address, city, state, zip, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const [staffResponse] = await connection.execute(staffQuery, [req.body.fName, req.body.mName, req.body.lName, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.phoneNumber]);
        const staffID = staffResponse.insertId;

        const updateAccountQuery = "UPDATE Account SET staffID = ? WHERE accountID = ?";
        const [updateResponse] = await connection.execute(updateAccountQuery, [staffID, accountID]);
      
        await connection.commit();
        return {"message": "Account successfully created"};
      }
      catch(err){
        console.log(err);
        await connection.rollback();
        return {"Error":"Error creating account"};
      }
      finally{
        await connection.release();
      }
    }

    async updateAccount(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        // Allow only A–Z, a–z, 0–9 for username
        const usernameValidation = /^[A-Za-z0-9]+$/;
        // Allow only letters for names
        const nameValidation = /^[A-Za-z]+$/;
        // Allow only letters for names but and an empty string to be sent
        const mNameValidation = /^[A-Za-z]*$/;

        const accountID = parseInt(req.body.accountID);
        if(!Number.isInteger(accountID) || !usernameValidation.test(req.body.username) || !nameValidation.test(req.body.fName) || !mNameValidation.test(req.body.mName) || !nameValidation.test(req.body.lName)){
          return {"Error":"Invalid input"};
        }
        await connection.beginTransaction();
        
        const accountQuery = "UPDATE Account SET disabled = ? WHERE accountID = ?";
        const [accountResponse] = await connection.execute(accountQuery, [req.body.disabled, accountID]);
        const [acctRows] = await connection.execute(`SELECT staffID FROM Account WHERE accountID = ?`,[accountID]);
        if (acctRows.length != 1) {
          await connection.rollback();
          return { "Error": "Account not found" };
        }
        const staffID = acctRows[0].staffID;
        
        const staffQuery = "UPDATE Staff SET fName = ?, mName = ?, lName = ?, address = ?, city = ?, state = ?, zip = ?, phoneNumber = ? WHERE staffID = ?";
        const [staffResponse] = await connection.execute(staffQuery, [req.body.fName, req.body.mName, req.body.lName, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.phoneNumber, staffID]);

        await connection.commit();
        return {"message": "Account successfully updated"};
      }
      catch(err){
        console.log(err);
        await connection.rollback();
        return {"Error":"Error updating account"};
      }
      finally{
        await connection.release();
      }
    }

    async deleteAccount(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        const accountID = parseInt(req.body.accountID);
        if(!Number.isInteger(accountID)){
          return {"Error":"Invalid Request"};
        }
        await connection.beginTransaction();
        const [acctRows] = await connection.execute(`SELECT staffID FROM Account WHERE accountID = ?`,[accountID]);
        if (acctRows.length != 1) {
          await connection.rollback();
          return { "Error": "Account not found" };
        }
        const staffID = acctRows[0].staffID;
        const [accountResponse] = await connection.execute(`DELETE FROM Account WHERE accountID = ?`, [accountID]);
        const [staffResponse] = await connection.execute(`DELETE FROM Staff WHERE staffID = ?`, [staffID]);
        await connection.commit();
        return {"message": "Account successfully deleted"};
      }
      catch(err){
        await connection.rollback();
        return {"Error":"Error deleting account"};
      }
      finally{
        await connection.release();
      }
    }

    async createStaffClient(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        const clientID = parseInt(req.body.clientID);
        const staffID = parseInt(req.body.staffID);
        
        if(!Number.isInteger(clientID) || !Number.isInteger(staffID)){
          return {"Error":"Invalid Request"};
        }
        
        await connection.beginTransaction();

        const countQuery = "SELECT * FROM StaffClient WHERE staffID = ? AND clientID = ?;";
        const [countResult] = await connection.execute(countQuery, [staffID, clientID]);
        if(countResult.length > 0){
          await connection.rollback();
          return {"Error":"Staff-client link already exists"};
        }

        const staffClientQuery = "INSERT INTO StaffClient(clientID, staffID, title, dateAssigned) VALUES(?, ?, ?, CURRENT_TIMESTAMP())";
        const [staffClientResponse] = await connection.execute(staffClientQuery, [clientID, staffID, req.body.title]);
        
        await connection.commit();
        return {"message": "Staff linked to client successfully"};
      }
      catch(err){
        console.log(err);
        await connection.rollback();
        return {"Error":"Error creating staff-client link"};
      }
      finally{
        await connection.release();
      }
    }

    async deleteStaffClient(req){
      const connection = await this.#pool.getConnection();
      try{
        const account = await this.isAuthenticated(req, true);
        if(account["Error"]){
          return account["Error"];
        }
        const clientID = parseInt(req.body.clientID);
        const staffID = parseInt(req.body.staffID);
        
        if(!Number.isInteger(clientID) || !Number.isInteger(staffID)){
          return {"Error":"Invalid Request"};
        }
        
        await connection.beginTransaction();

        const staffClientQuery = "DELETE FROM StaffClient WHERE clientID = ? AND staffID = ?";
        const [staffClientResponse] = await connection.execute(staffClientQuery, [clientID, staffID]);
        
        await connection.commit();
        return {"message": "Staff-client link successfully created"};
      }
      catch(err){
        await connection.rollback();
        return {"Error":"Error deleting staff-client link"};
      }
      finally{
        await connection.release();
      }
    }

      /**
   * Queries the database for the client's medication list.
   * @param {number} clientID
   * @returns {Promise<*|{Error: string}>}
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
    async getVaccinationList(clientID) {
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
    async getCaseNoteList(clientID) {
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
    async getCaseNote(noteID) {
        if (noteID == null || (typeof noteID != "number")) {
            return {"Error": "Invalid NoteID"};
        }

        let caseNoteStmt = "SELECT Note.noteID, subject, dateCreated, staffID, name as programName, dateModified, contactType, goal, narrative, goalProgress, nextSteps, dateOfEvent FROM Note JOIN HCAR.Program P on Note.programID = P.programID WHERE Note.noteID = ?";

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
    async getSupportStaffList(clientID) {
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

    /**
     * Used to get data for simple client list report
     * @param account
     * @returns {Promise<Object[]|undefined[]>}
     */
    async getSimpleClientList(account) {
        const stmt = "SELECT CONCAT_WS(' ', fName, mName, lName) as name, dateOfBirth, gender FROM Account a LEFT JOIN StaffClient sc on a.staffID = sc.staffID INNER JOIN listAllClients c ON ((a.admin = 1) OR (sc.clientID = c.clientID AND a.admin = 0)) WHERE accountID = ? ORDER BY c.lName";
        try{
            const [results] = await this.#pool.execute(stmt, [account]);
            if (results.length > 0) {
                return results;
            } else {
                return [];
            }
        } catch (e) {
            console.log("Error: Failure getting Simple Client List; " + e);
            return [];
        }
    }

    async getSimpleClientBio(clientID) {
        const stmt = "SELECT fname, mName, lName, dateOfBirth, phoneNumber, address, city, state, zip, sex, gender, pronouns FROM simpleClientBio WHERE clientID = ?";
        try{
            const [results] = await this.#pool.execute(stmt, [clientID]);
            return results[0];
        } catch (e) {
            console.log("Error: Failure getting client's simple demographics => " + e );
            return {error: "Failure getting client's simple demographics"};
        }

    }

    async getMailingList(account) {
        const stmt = "SELECT CONCAT_WS(' ', fName, mName, lName) as name, phoneNumber, address, city, state, zip FROM Account a LEFT JOIN StaffClient sc on a.staffID = sc.staffID INNER JOIN mailList c ON ((a.admin = 1) OR (sc.clientID = c.clientID AND a.admin = 0)) WHERE accountID = ? ORDER BY c.lName";
        try{
            const [results] = await this.#pool.execute(stmt, [account]);
            if (results.length > 0) {
                return results;
            } else {
                return [];
            }
        } catch (e) {
            console.log("Error: Failure getting Simple Client List; " + e);
            return [];
        }
    }

    async getexpPurchaseInMonth(account) {
        const stmt = "SELECT CONCAT_WS(' ', fName, mName, lName) as name, dateOfBirth, phoneNumber, pos, daysRemaining FROM Account a LEFT JOIN StaffClient sc on a.staffID = sc.staffID INNER JOIN posNearExpiration c ON ((a.admin = 1) OR (sc.clientID = c.clientID AND sc.clientID = c.clientID)) WHERE accountID = ? ORDER BY daysRemaining";
        try{
            const [results] = await this.#pool.execute(stmt, [account]);
            if (results.length > 0) {
                return results;
            } else {
                return [];
            }
        } catch (e) {
            console.log("Error: Failure getting Simple Client List; " + e);
            return [];
        }
    }

    async checkAccountClientPerms(accountID, clientID){
        if (accountID == null || clientID == null) {
            return {"Error": "Invalid Authentication"};
        }
        try{
            const [acctRows] = await this.#pool.execute("SELECT admin FROM Account WHERE accountID = ?",
                [accountID]);
            // forgot js has the nullable check
            if (acctRows[0]?.admin === 1) {
                return true;
            }

            // Check staff-client mapping for non-admins
            const [rows] = await this.#pool.execute("SELECT COUNT(*) as count FROM StaffClient SC JOIN Account A ON SC.staffID = A.staffID WHERE A.accountID = ? AND SC.clientID = ?",
                [accountID, clientID]
            );
            return rows[0]?.count > 0;
        } catch (e) {
            console.log("Error: Failed to check AccountClient perms" + e);
            return false;
        }
    }

    /*==========================================================================================*/
    /* Methods below are more related to the Instance's properties and should be used sparingly *
     *==========================================================================================*/

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
