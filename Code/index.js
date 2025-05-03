import express from "express"
import session from 'express-session';
const app = express()
import {reportTypes} from "./reportsLogic.js";
import {ClientBuilder} from "./objects/ClientBuilder.js";
import Programs from "./objects/Programs.js";
const port = process.env.PORT || 8080;
import { fileURLToPath } from 'url';
import path from 'path';
import {testClientArray} from "./testData.js"
import QueryParser from "./objects/QueryParser.js";
import QueryParserBuilder from "./objects/QueryParserBuilder.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));

// For handling form data
app.use(express.urlencoded({extended: true}));

// Handling JSON payloads
app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false, //Doesn't save every session, only modified ones.
      resave: false, //Avoids resaving of the session if it hasn't changed
      cookie: {
        maxAge: 86400000, //One day(miliseconds)
        secure: process.env.SECURE_SESSION, //Set to true in prod(Requires HTTPS for cookies to be set)
        httpOnly: true, //Disallows browser js from accessing cookie
        sameSite: 'strict', //CSRF Protection
      },
    })
  );

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/index.html"))
});

app.post('/home', getPath, (req, res) => {
    // After verification of credentials
    res.render("home");
});

// Clicking home from home will re-render the page
app.get('/home', getPath, (req, res) => {
    res.render("home");
});

app.get("/search", getPath, (req, res) => {
    res.render("search");
})

// TODO: MAKE THIS POST OBVIOUSLY
app.get('/results', (req, res) => {
    res.render("results", {clientList: testClientArray});
});

// Sanitize data sent to results
app.post('/results', sanitize, async (req, res) => {
    // Get client list from fetched results (Uncomment later)
    /* const resClients = req.clients; */
    const searchData = req.body;
    let qp = await new QueryParserBuilder().build()
    let results = await qp.getAllFilteredClients(1, searchData);    // Later replace with accID
    // Build Clients for each returned row
    let clients = [];
    if (results[0] !== undefined)
    {
        console.log("Results: ", results[0]);   // Uncomment for debugging
        console.log("Programs: ", results[1]);   // Uncomment for debugging
        for (const client of results[0])
        {
            clients.push(new ClientBuilder()
            .setClientID(client.clientID !== null ? client.clientID : "Empty")
            .setFirstName(client.fName !== null ? client.fName : "Empty")
            .setLastName(client.lName !== null ? client.lName : "Empty")
            .setPhoneNumber(client.phoneNumber !== null ? client.phoneNumber : "Empty")
            .setEmail(client.email !== null ? client.email : "Empty")
            .setDOB(client.dateOfBirth !== null ? new Date(client.dateOfBirth) : "Empty")
            .setPronouns(client.pronouns !== null ? client.pronouns : "Empty")
            .setSex(client.gender !== null ? client.gender : "Empty")
            .setPrograms(new Programs(results[1].filter(program => program.clientID === client.clientID)))
            .build());
        }
    }
    res.render("results", {clientList: clients});
});

app.get("/reports", getPath, (req, res) => {
    res.render("reports", {availableReportsMap: reportTypes});
});

app.get("/caseNote", (req, res) => {
    res.render("caseNote", {theClient: testClientArray[0]});
})

app.post('/api/auth', async (req, res) => {
  
  let qp = await new QueryParserBuilder().build()
  const results = await qp.auth(req);
  return res.send(results);
});
/**
 * Body: {
 *   clientID:    number,
 *   contactType: string,
 *   goal:        string,
 *   goalProgress:string,
 *   narrative:   string,
 *   nextSteps:   string
 * }
 * Response on error: { "Error": "…message…" }
 * Response on success: "Case note successfully created"
 */
app.post('/api/createCaseNote', async (req, res) => {
  
    let qp = await new QueryParserBuilder().build()
    const results = await qp.createCaseNote(req);
    return res.send(results);
  });

/*
* Body: {
 *   clientID:    string
 *   contactType: string,
 *   goal:        string,
 *   goalProgress:string,
 *   narrative:   string,
 *   nextSteps:   string
 *   noteID:      string
 * }
 * Response on error: { "Error": "…message…" }
 * Response on success: "Case note successfully updated"
 */
app.post('/api/updateCaseNote', async (req, res) => {
  let qp = await new QueryParserBuilder().build()
  const results = await qp.updateCaseNote(req);
  return res.send(results);
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
    return res.send(results);
  });

app.get('/client', (req, res) => {
    let rawData = req.body.clientID;
    res.render("clientDetails", {theClient: testClientArray[0]});
});

app.post('/client', sanitize, (req, res) => {
    let cliID = req.body.clientID;
    res.json({redirect: `/client/${cliID}`});
});

// Redirection from POST request 
app.get('/client/:id', async (req, res) => {
    const cliID = Number(req.params.id);
    // DB Queries
    let qp = await new QueryParserBuilder().build()
    let clientDemographics = await qp.getClientDemographics(cliID);
    let insuranceAndMedicalPreferences = await qp.getInsuranceAndMedicalPreferences(cliID);
    let medicationList = await qp.getMedicationList(cliID);
    console.log("Demographics: ", clientDemographics);
    console.log("Insurance: ", insuranceAndMedicalPreferences);
    console.log("Medication: ", medicationList);

    // Build client
    

    res.render("clientDetails", {theClient: testClientArray[0]});
});

app.get("/test", async (req, res) => {
    let qp = await new QueryParserBuilder().build()
    let results = await qp.getAllClients(1)
    res.send(results);
})

/* Port Number should be an environment variable fyi */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

process.on('SIGTERM',async () => {
    try {
        if (QueryParser.hasInstance()) {
            const queryParser = new QueryParserBuilder().build();
            await queryParser.destructor();
        }
    } catch (error) {
        console.error('Error while closing the database connection:', error);
    } finally {
        process.exit(0);
    }
});

function sanitize(req, res, next)
{
    for (const key in req.body)
    {
        // If non-null field
        if (req.body[key] !== "")
        {
            // Sanitize data
            if (key === "email")
                req.body[key] = req.body[key].replace(/[^\w@\.]/g, "");
            else
                req.body[key] = req.body[key].replace(/[\W]/g, "");
        }
    }
    next();
}

function getPath(req, res, next)
{
    res.locals.currentPath = req.path;
    next();
}