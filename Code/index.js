import express from "express"
import session from 'express-session';
import favicon from "serve-favicon";
const app = express();
import MySQLSession from 'express-mysql-session';
const MySQLStore = MySQLSession(session);
const port = process.env.PORT || 8080;
import {reportTypes} from "./reports-logic/reportTypes.js";
import {ClientBuilder} from "./objects/ClientBuilder.js";
import Programs from "./objects/Programs.js";
import Medication from "./objects/Medication.js";
import Insurance from "./objects/Insurance.js";
import ContactInfo from "./objects/ContactInfo.js";
import Address from "./objects/Address.js";
import Vaccination from "./objects/Vaccination.js";
import {SupportStaff} from "./objects/SupportStaff.js";
import CaseNote from "./objects/CaseNote.js";
import { fileURLToPath } from 'url';
import path from 'path';
import {testClientArray} from "./testData.js"
import QueryParser from "./objects/QueryParser.js";
import QueryParserBuilder from "./objects/QueryParserBuilder.js";
import {
    caseNotePDFData,
    expPurchaseInMonthReport,
    listAllClientsReport,
    mailListReport,
    medInfoReport
} from "./reports-logic/reports.js";
import { constants } from "os";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');

app.use(favicon(__dirname + '/public/icons/favicon.ico'));

app.use(express.static(__dirname + '/public'));

// For handling form data
app.use(express.urlencoded({extended: true}));

// Handling JSON payloads
app.use(express.json());
app.set('trust proxy', 1) // trust first proxy
let topQP = await new QueryParserBuilder().build();
const sessionStore = new MySQLStore({}, topQP.getPool());
app.use(
    session({
        name: '__session',
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false, //Doesn't save every session, only modified ones.
        resave: false, //Avoids resaving of the session if it hasn't changed
        store: sessionStore, //  Make express-sesssion use the MySQL session store
        cookie: {
          maxAge: 86400000, //One day(miliseconds)
          secure: process.env.SECURE_SESSION === "true", //Set to true in prod(Requires HTTPS for cookies to be set)
          httpOnly: true, //Disallows browser js from accessing cookie
          sameSite: 'strict', //CSRF Protection
        },
    })
  );


app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.get('/', async (req, res) => {
    if (req.session.accountID){
        res.redirect("/home");
    } else{
        res.sendFile(path.join(__dirname, "public/html/index.html"))
    }
});

app.post('/home', getPath, async (req, res) => {
  const qp     = await new QueryParserBuilder().build();
  const result = await qp.auth(req);

  // 1) Bad creds or disabled
  if (result.Error) {
    return res.redirect('/');
  }

  // 2) Password reset required
  if (result.message === 'Please setup your new password') {
    return res.redirect('/reset-password');
  }

  // 3) Successful login
  //    qp.auth has already put accountID (and temporaryPassword=0) into the session
  const account = await qp.isAuthenticated(req);
  return res.render('home', { theAccount: account });
});

// Clicking home from home will re-render the page
app.get('/home', getPath, async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        // TODO: Change index.html to an EJS file so we can render login and auth failures
        res.redirect("/");
    } else {
        // After verification of credentials
        res.render("home", {theAccount: account});
    }
});

app.get("/reset-password", (req, res) => {
  // ensure they really hit the reset flow
  if (!req.session.temporaryPassword || !req.session.accountID) {
    return res.redirect("/");
  }
  res.render("resetPassword");  // your EJS form
});

app.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.get("/search", getPath, async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        // TODO: Change index.html to an EJS file so we can render login and auth failures
        res.redirect("/");
    } else {
        // After verification of credentials
        res.render("search");
    }
});

// Sanitize data sent to results
app.get('/results', sanitize, async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        // TODO: Change index.html to an EJS file so we can render login and auth failures
        res.redirect("/");
    } else {
        // After verification of credentials
        // Get client list from fetched results (Uncomment later)
        const offset = parseInt(req.query.page) ? (parseInt(req.query.page) -1) : 0;
        const searchData = req.query;
        //console.log(searchData)
        let results = await qp.getAllFilteredClients(req.session.accountID, searchData, offset);
        // Build Clients for each returned row
        let clients = [];
        if (results[0] !== undefined)
        {
            for (const client of results[0])
            {
                clients.push(new ClientBuilder()
                    .setClientID(client.clientID !== null ? client.clientID : "Empty")
                    .setFirstName(client.fName !== null ? client.fName : "Empty")
                    .setMiddleName(client.mName !== null ? client.mName : "")
                    .setLastName(client.lName !== null ? client.lName : "Empty")
                    .setPhoneNumber(client.phoneNumber !== null ? client.phoneNumber : "Empty")
                    .setEmail(client.email !== null ? client.email : "Empty")
                    .setDOB(client.dateOfBirth !== null ? new Date(client.dateOfBirth) : "Empty")
                    .setPronouns(client.pronouns !== null ? client.pronouns : "Empty")
                    .setSex(client.gender !== null ? client.gender : "Empty")
                    .setPrograms(new Programs({names: results[1].filter(program => program.clientID === client.clientID).map(program => program.name)}))
                    .setPOS(client.pos !== null ? new Date(client.pos) : "")
                    .setPictureURL(client.profilePictureFilename !== null ? client.profilePictureFilename : "")
                    .build());
            }
        }
        res.render("results", {clientList: clients});
    }
});

app.get("/results/all", async(req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        // TODO: Change index.html to an EJS file so we can render login and auth failures
        res.redirect("/");
    } else {
        // After verification of credentials
        // Get client list from fetched results (Uncomment later)
        const offset = parseInt(req.query.page) ? (parseInt(req.query.page) -1) : 0;
        let results = await qp.getAllClients(req.session.accountID, offset);
        // Build Clients for each returned row
        let clients = [];
        if (results[0] !== undefined)
        {
            for (const client of results[0])
            {
                clients.push(new ClientBuilder()
                    .setClientID(client.clientID !== null ? client.clientID : "Empty")
                    .setFirstName(client.fName !== null ? client.fName : "Empty")
                    .setMiddleName(client.mName !== null ? client.mName : "")
                    .setLastName(client.lName !== null ? client.lName : "Empty")
                    .setPhoneNumber(client.phoneNumber !== null ? client.phoneNumber : "Empty")
                    .setEmail(client.email !== null ? client.email : "Empty")
                    .setDOB(client.dateOfBirth !== null ? new Date(client.dateOfBirth) : "Empty")
                    .setPronouns(client.pronouns !== null ? client.pronouns : "Empty")
                    .setSex(client.gender !== null ? client.gender : "Empty")
                    .setPrograms(new Programs({names: results[1].filter(program => program.clientID === client.clientID).map(program => program.name)}))
                    .setPOS(client.pos !== null ? new Date(client.pos) : "")
                    .setPictureURL(client.profilePictureFilename !== null ? client.profilePictureFilename : "")
                    .build());
            }
        }
        res.render("results", {clientList: clients});
    }
});

app.get("/reports", authCheck, getPath, async (req, res) => {
    // After verification of credentials
    res.render("reports", {availableReportsMap: reportTypes});
});

app.post("/reports/generate", authCheck, sanitize, getPath,  async (req, res) => {
    const reportType = req.body.reportType.toString();
    if (!reportTypes.has(reportType)){
        // Invalid report, just send the wacky user back to reports page
        res.redirect("/reports");
    }
    switch (reportType) {
        case "mailList":
            res.render("generatedReportData", {reportType: reportType, reportName: "Mailing List"});
            break;
        case "expPurchaseInMonth":
            res.render("generatedReportData", {reportType: reportType, reportName: "Purchase of Services Expiring Soon"});
            break;
        case "listAllClients":
            res.render("generatedReportData", {reportType: reportType, reportName: "List of All Viewable Clients"});
            break;
        default:
            // Theoretically, this should never happen...
            res.redirect("/reports");
            break;
    }
});

app.get("/admin", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req, true);

    if (!account.admin) {
        res.redirect("/home");
    }
    else {
        res.render("admin", {employeeList: []});
    }
});

app.post("/admin/addempl", sanitize, async (req, res) => {
    if (req.body.addEmployeePass !== req.body.addEmployeePassConf) {
        // alert("Passwords do not match");
        res.redirect("/admin");
    }
    else {
        let qp = await new QueryParserBuilder().build()
        let employeeFields = {
            fName: req.body.addEmployeeFName,
            mName: req.body.addEmployeeMName,
            lName: req.body.addEmployeeLName,
            username: req.body.addEmployeeUser,
            password: req.body.addEmployeePass,
        }
        console.log(employeeFields);

        const results = await qp.createAccount(employeeFields);
        console.log(results);
        res.send(results);
    }
});

app.post("/admin/removeempl", sanitize, async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    let emplList = qp.searchStaff(req);

    res.render("admin", {employeeList: emplList});
})

// Complete this to accomodate for new, and edit/view/delete
app.post("/caseNote", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        res.redirect("/");
    } else {
        // After verification of credentials
        const noteCreator = await qp.getEmployeeName(account.staffID);
        const client = req.body.clientID;     // Client Object
        const note = req.body.noteID;     // Case Note 
        const type = req.body.button;       // Button pressed

        // Session Data Transfer
        req.session.caseNoteInfo = {
            client: client,
            note: note,
            noteCreator: noteCreator[0].creator
        };

        res.json({redirect: `/caseNote/${type}`});
    }
});

// Creating a new case note
app.get("/caseNote/new", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        res.redirect("/");
    } else {
        const clientID = Number(req.session.caseNoteInfo.client);
        const noteCreator = req.session.caseNoteInfo.noteCreator;
        // Rebuild class objects
        let clientDem = await qp.getClientDemographics(clientID);
        let progs = await qp.getClientPrograms(clientID);
        // Build client
        let client = rebuildClient(clientDem, progs);
        res.render("caseNote", {theClient: client, method: "new", noteCreator: noteCreator});
    }
});

// Viewing/editing existing case note USE GETCASENOTE
app.get("/caseNote/viewedit", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        res.redirect("/");
    } else {
        const clientID = Number(req.session.caseNoteInfo.client);
        const noteID = req.session.caseNoteInfo.note;
        const noteCreator = req.session.caseNoteInfo.noteCreator;
        // Rebuild class objects
        let clientDem = await qp.getClientDemographics(clientID);
        let progs = await qp.getClientPrograms(clientID);
        let noteDetails = await qp.getCaseNote(noteID);
        noteDetails.employeeSign = account.staffID;    
        // Build Case Note
        let note = rebuild(CaseNote, noteDetails);
        // Build Client
        let client = rebuildClient(clientDem, progs);
        res.render("caseNote", {theClient: client, note: note, noteCreator: noteCreator, method: "viewedit"});
    }
});

// Download a case note
app.post("/caseNote/download",authCheck, async (req, res) => {
    const clientID = parseInt(req.body.clientID);
    const noteID = parseInt(req.body.noteID);
    if (clientID == null || noteID == null || typeof clientID !== "number" || typeof noteID !== "number"){
        return res.status(400).json({error: "Missing valid POST body"});
    }
    const qp = await new QueryParserBuilder().build();
    const permCheck = await qp.checkAccountClientPerms(req.session.accountID, clientID);
    if (!permCheck){
        return res.status(403).json({error: "You do not have permission to view this client"});
    }


    await caseNotePDFData(noteID, req, res);
})

app.post('/api/auth', sanitize, async (req, res) => {
  let qp     = await new QueryParserBuilder().build();
  const result = await qp.auth(req);

  if (result.Error) {
    return res.json({ Error: result.Error });
  }

  if (result.message === 'Please setup your new password') {
    return res.json({
      resetRequired: true,
      message: result.message
    });
  }

  return res.json({
    resetRequired: false,
    message: result.message
  });
});

/**
 * Body: {
 *   clientID:      number,
 *   contactType:   string,
 *   goal:          string,
 *   goalProgress:  string,
 *   narrative:     string,
 *   nextSteps:     string,
 *   noteID:        string,
 *   subject:       string,
 *   dateOfSignoff: Date,
 *   dateOfEvent:   Date,
 *   program:       string
 * }
 * Response on error: { "Error": "…message…" }
 * Response on success: "Case note successfully created"
 */
app.post('/api/createCaseNote', sanitize, async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.createCaseNote(req);
    console.log(req.session.id);
    return res.json(results);
  });

/*
* Body: {
 *   clientID:      string
 *   contactType:   string,
 *   goal:          string,
 *   goalProgress:  string,
 *   narrative:     string,
 *   nextSteps:     string,
 *   noteID:        string,
 *   subject:       string,
 *   dateOfSignoff: Date,
 *   dateOfEvent:   Date,
 *   program:       string,
 * }
 * Response on error: { "Error": "…message…" }
 * Response on success: "Case note successfully updated"
 */
app.post('/api/updateCaseNote', sanitize, async (req, res) => {
  let qp = await new QueryParserBuilder().build()
  const results = await qp.updateCaseNote(req);
  return res.json(results);
});
  
  
  /**
   * Body: {
   *   clientID: number,
   *   noteID:   number
   * }
   * Response on error: { "Error": "…message…" }
   * Response on success: "Case note successfully deleted"
   */
  app.post('/api/deleteCaseNote', async (req, res) => {
  
    let qp = await new QueryParserBuilder().build()
    const results = await qp.deleteCaseNote(req);
    return res.json(results);
  });

  app.post('/api/createClient', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.createClient(req);
    return res.json(results);
  });

  app.post('/api/updateClient', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.updateClient(req);
    return res.json(results);
  });

  app.post('/api/deleteClient', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.deleteClient(req);
    return res.json(results);
  });

  app.post('/api/createAccount', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.createAccount(req);
    return res.json(results);
  });

  app.post('/api/updateAccount', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.updateAccount(req);
    return res.json(results);
  });

  app.post('/api/deleteAccount', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.deleteAccount(req);
    return res.json(results);
  });

  app.post('/api/createStaffClient', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.createStaffClient(req);
    return res.json(results);
  });
  app.post("/api/deleteStaffClient", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.deleteStaffClient(req);
    return res.json(results);
  })
  app.post("/api/searchStaff", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.searchStaff(req);
    return res.json(results);
  })
  app.post("/api/resetPassword", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const results = await qp.resetPassword(req);
    return res.json(results);
  })
  // in your index.js (or app.js), after you set up sanitize and session:

app.post('/api/updatePassword', sanitize, async (req, res) => {
  const qp = await new QueryParserBuilder().build();

  const result = await qp.updatePassword(req);

  if (result.Error) {
    return res.render('resetPassword', { error: result.Error });
  }

      return res.redirect('/home');
});




app.post('/client', sanitize, async (req, res) => {
    let cliID = req.body.clientID;
    res.json({redirect: `/client/${cliID}`});
});

// Redirection from POST request 
app.get('/client/:id', async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        res.redirect("/");
    } else {
        // After verification of credentials
        const cliID = Number(req.params.id);
        // DB Queries
        let cliDem = await qp.getClientDemographics(cliID);
        let insurAndMed = await qp.getInsuranceAndMedicalPreferences(cliID);
        let medicationList = await qp.getMedicationList(cliID);
        let vaccinationList = await qp.getVaccinationList(cliID);
        let caseNotesList = await qp.getCaseNoteList(cliID);
        let supportStaffList = await qp.getSupportStaffList(cliID);
        let meds = [];
        let vaccines = [];
        let caseNotes = [];
        let supportStaff = [];

        // Comprehension for med list
        for (const med of medicationList)
        {
            let m = new Medication({
                name: med.name !== null ? med.name : "Empty",
                prn: med.prn !== null ? med.prn : 0,
                dosage: med.dosage !== null ? med.dosage : "Empty",
                timesOfDay: med.frequency !== null ? med.frequency : "Empty",
                purpose: med.purpose !== null ? med.purpose : "Empty",
                sideEffects: med.sideEffects !== null ? med.sideEffects : "Empty",
                prescriber: med.prescriber !== null ? med.prescriber : "Empty"
            });
            meds.push(m);
        }

        // Comprehension for Vaccinations
        for (const vac of vaccinationList)
        {
            let v = new Vaccination({
                shotType: vac.name !== null ? vac.name : "Empty",
                dateTaken: vac.dateTaken !== null ? new Date(vac.dateTaken) : "Empty"
            })
            vaccines.push(v);
        }

        // Comprehension for Case Notes
        for (const note of caseNotesList)
        {
            // Setting only values needed for display, retrieve other columns when necessary
            let n = new CaseNote({
                noteID: note.noteID !== null ? note.noteID : -1,
                subject: note.subject !== null ? note.subject : "Empty",
                programName: note.programName !== null ? note.programName : "Empty",
                dateCreated: note.dateCreated !== null ? new Date(note.dateCreated) : "Empty",
                employeeSign: note.creator !== null ? note.creator : "Empty"
            })
            caseNotes.push(n);
        }

        // Comprehension for Support Staff
        for (const staff of supportStaffList)
        {
            let s = new SupportStaff({
                name: staff.staffName !== null ? staff.staffName : "Empty",
                title: staff.title !== null ? staff.title : "Empty",
                idNumber: staff.staffID !== null ? staff.staffID : 0,
                dateAssigned: staff.dateAssigned !== null ? new Date(staff.dateAssigned) : "Empty",
                dateRemoved: staff.dateRemoved !== null ? new Date(staff.dateRemoved) : "Empty"
            })
            supportStaff.push(s);
        }

        // Build client
        const client = new ClientBuilder()
        .setClientID(cliDem.clientID !== null ? cliDem.clientID : "")
        .setFirstName(cliDem.fName !== null ? cliDem.fName : "")
            .setMiddleName(cliDem.mName !== null ? cliDem.mName : "")
            .setLastName(cliDem.lName !== null ? cliDem.lName : "")
        .setEmail(cliDem.email !== null ? cliDem.email : "")
        .setAddress(new Address({
            streetAddress: cliDem.address !== null ? cliDem.address : "",
            city: cliDem.city !== null ? cliDem.city : "",
            state: cliDem.state !== null ? cliDem.state : "",
            zip: cliDem.zip !== null ? cliDem.zip : ""
        }))
        .setDOB(cliDem.dateOfBirth !== null ? new Date(cliDem.dateOfBirth) : "")
        .setPhoneNumber(cliDem.phoneNumber !== null ? cliDem.phoneNumber : "")
            .setSex(cliDem.sex != null ? cliDem.sex : "")
        .setGender(cliDem.gender !== null ? cliDem.gender : "")
        .setPronouns(cliDem.pronouns !== null ? cliDem.pronouns : "")
        .setMaritalStatus(cliDem.maritalStatus === 0 ? "Single" : "Divorced")   // Change later?
        .setPreferredHospital(cliDem.preferredHospital !== null ? cliDem.preferredHospital : "")
        .setLikes(cliDem.likes !== null ? cliDem.likes : "")
        .setDislikes(cliDem.dislikes !== null ? cliDem.dislikes : "")
        .setGoals(cliDem.goals !== null ? cliDem.goals : "")
        .setHobbies(cliDem.hobbies !== null ? cliDem.hobbies : "")
        .setAchievements(cliDem.achievements !== null ? cliDem.achievements : "")
        .setPictureURL(cliDem.profilePicture !== null ? cliDem.profilePicture : "")
        // Setting insurance
        .setPrimaryInsurance(new Insurance({
            id: (insurAndMed.primaryInsurance && insurAndMed.primaryInsurance.insuranceID !== null) ? insurAndMed.primaryInsurance.insuranceID : "",
            name: (insurAndMed.primaryInsurance && insurAndMed.primaryInsurance.name !== null) ? insurAndMed.primaryInsurance.name : "",
            policyNumber: (insurAndMed.primaryInsurance && insurAndMed.primaryInsurance.policyNumber !== null) ? insurAndMed.primaryInsurance.policyNumber : ""
        }))
        .setSecondaryInsurance(new Insurance({
            id: (insurAndMed.secondaryInsurance && insurAndMed.secondaryInsurance.insuranceID !== null) ? insurAndMed.secondaryInsurance.insuranceID : "",
            name: (insurAndMed.secondaryInsurance && insurAndMed.secondaryInsurance.name !== null) ? insurAndMed.secondaryInsurance.name : "",
            policyNumber: (insurAndMed.secondaryInsurance && insurAndMed.secondaryInsurance.policyNumber !== null) ? insurAndMed.secondaryInsurance.policyNumber : ""
        }))
        .setPcp(new ContactInfo({
            id: (insurAndMed.pcp && insurAndMed.pcp.contactID !== null) ? insurAndMed.pcp.contactID : "",
            name: (insurAndMed.pcp && insurAndMed.pcp.name !== null) ? insurAndMed.pcp.name : "",
            phoneNumber: (insurAndMed.pcp && insurAndMed.pcp.phoneNumber !== null) ? insurAndMed.pcp.phoneNumber : "",
            address: (insurAndMed.pcp && insurAndMed.pcp.address !== null) ? insurAndMed.pcp.address : ""
        }))
        .setPrimaryPhysician(new ContactInfo({
            id: (insurAndMed.primaryPhysician && insurAndMed.primaryPhysician.contactID !== null) ? insurAndMed.primaryPhysician.contactID : "",
            name: (insurAndMed.primaryPhysician && insurAndMed.primaryPhysician.name !== null) ? insurAndMed.primaryPhysician.name : "",
            phoneNumber: (insurAndMed.primaryPhysician && insurAndMed.primaryPhysician.phoneNumber !== null) ? insurAndMed.primaryPhysician.phoneNumber : "",
            address: (insurAndMed.primaryPhysician && insurAndMed.primaryPhysician.address !== null) ? insurAndMed.primaryPhysician.address : ""
        }))
        // Setting medication
        .setMedicationList(meds)
        // Setting vaccinations
        .setVaccinationList(vaccines)
        // Setting support staff
        .setSupportTeam(supportStaff)
        // Setting case notes
        .setCaseNoteList(caseNotes)
            .setPOS(cliDem.pos !== null ? new Date(cliDem.pos) : "")
            .build();
        //console.log(client.getPcp().getID());
        res.render("clientDetails", {theAccount: account, theClient: client});
    }
});

/**
 * Endpoint for medical reports
 * response: {
 *
 * }
 */
app.post("/api/reports/medInfo", authCheck, sanitize, async (req, res) => {
    const clientID = parseInt(req.body.clientID);
    if (clientID == null || typeof clientID !== "number"){
        return res.status(400).json({error: "Missing valid POST body"});
    }
    const qp = await new QueryParserBuilder().build();
    const permCheck = await qp.checkAccountClientPerms(req.session.accountID, clientID);
    if (!permCheck){
        return res.status(403).json({error: "You do not have permission to view this client"});
    }

    await medInfoReport(clientID, req, res);
});

/**
 * See reports.js for the implementation of the reports
 */
app.get("/api/reports/:reportType", authCheck, async (req, res) => {
    const reportType = req.params.reportType.toString();
    if (!reportTypes.has(reportType)){
        // Invalid report
        res.status(500).json({error: "Unknown report type"});
    }
    switch (reportType) {
        case "mailList":
            await mailListReport(req.session.accountID, req, res);
            break;
        case "expPurchaseInMonth":
            await expPurchaseInMonthReport(req.session.accountID, req, res);
            break;
        case "listAllClients":
            await listAllClientsReport(req.session.accountID, req, res);
            break;
        default:
            // Theoretically, this should never happen...
            res.status(500).json({error: "Unknown report type. Unsure of how you got here."});
            break;
    }
});



/* Misc. Middleware and Configuration */

/* Port Number should be an environment variable fyi */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

process.on('SIGTERM',async () => {
    try{
        await sessionStore.close();
    } catch (e) {
        console.log("Error: Failed to cleanly close the session store => " + e);
    }
    
    try {
        if (QueryParser.hasInstance()) {
            const queryParser = new QueryParserBuilder().build();
            await queryParser.destructor();
        }
    } catch (error) {
        console.error('Error while closing the database connection:', error);
    } finally {
        console.log("Server shutting down...");
        process.exit(0);
    }
});

// If no route is matched, path does not exist
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

function sanitize(req, res, next)
{
    if (req.method === "POST"){
        for (const key in req.body)
        {
            // If non-null field
            if (req.body[key] !== "" && typeof req.body[key] == "string")
            {
                // Sanitize data
                if (key === "email")
                    req.body[key] = req.body[key].replace(/[^\w@\.]/g, "");
                else
                    req.body[key] = req.body[key].replace(/[^\w-+ ]/g, "");
            }
        }
    } else{
        for (const key in req.query)
        {
            // If non-null field
            if (req.query[key] !== "" && typeof req.query[key] == "string")
            {
                // Sanitize data
                if (key === "email")
                    req.query[key] = req.query[key].replace(/[^\w@\.]/g, "");
                else if (key === "pronouns"){
                    req.query[key] = req.query[key].replace(/[^\w\- /]/g, "");
                }
                else
                    req.query[key] = req.query[key].replace(/[^\w- ]/g, "");
            }
        }
    }

    next();
}

function getPath(req, res, next)
{
    res.locals.currentPath = req.path;
    next();
}

// Helper function to rebuild class objects
function rebuild(ClassConstructor, obj)
{
    return new ClassConstructor(obj);
}

// Helper function to rebuild client objects with demographics and programs
// using builder pattern
function rebuildClient(client, programs)
{
    return new ClientBuilder()
        .setClientID(client.clientID !== null ? client.clientID : "Empty")
        .setFirstName(client.fName !== null ? client.fName : "Empty")
        .setLastName(client.lName !== null ? client.lName : "Empty")
        .setEmail(client.email !== null ? client.email : "Empty")
        .setAddress(new Address({
            streetAddress: client.address !== null ? client.address : "Empty",
            city: client.city !== null ? client.city : "Empty",
            state: client.state !== null ? client.state : "Empty",
            zip: client.zip !== null ? client.zip : "Empty" 
        }))
        .setDOB(client.dateOfBirth !== null ? new Date(client.dateOfBirth) : "Empty")
        .setPhoneNumber(client.phoneNumber !== null ? client.phoneNumber : "Empty")
        .setSex(client.gender !== null ? client.gender : "Empty")
        .setPronouns(client.pronouns !== null ? client.pronouns : "Empty")
        .setMaritalStatus(client.maritalStatus === 0 ? "Single" : "Divorced")   // Change later?
        .setPreferredHospital(client.preferredHospital !== null ? client.preferredHospital : "Empty")
        .setLikes(client.likes !== null ? client.likes : "Empty")
        .setDislikes(client.dislikes !== null ? client.dislikes : "Empty")
        .setGoals(client.goals !== null ? client.goals : "Empty")
        .setHobbies(client.hobbies !== null ? client.hobbies : "Empty")
        .setAchievements(client.achievements !== null ? client.achievements : "Empty")
        .setPictureURL(client.profilePicture !== null ? client.profilePicture : "")
        .setPrograms(programs !== null ? new Programs({names: programs.map(program => program.name)}) : new Programs({names: []}))
        .build();
}

async function authCheck(req, res, next) {
    let qp = await new QueryParserBuilder().build()
    const account = await qp.isAuthenticated(req);
    if (!account.username) {
        // Not verified
        res.redirect("/");
    } else {
        // After verification of credentials
        res.locals.username = account.username;
        res.locals.admin = account.admin;
        next();
    }
}