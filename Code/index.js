import express from "express"
const app = express()
import {reportTypes} from "./reportsLogic.js";
import {ClientBuilder} from "./objects/ClientBuilder.js";
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
    let results = await qp.getAllFilteredClients(1, searchData);    // How to handle empty search data?
    // Build Clients for each returned row
    // console.log("Results: ", results[0]);   // Uncomment for debugging
    let clients = [];
    if (results[0] !== undefined)
    {
        for (const client of results[0])
        {
            clients.push(new ClientBuilder()
            .setFirstName(client.fName !== null ? client.fName : "Empty")
            .setLastName(client.lName !== null ? client.lName : "Empty")
            .setPhoneNumber(client.phoneNumber !== null ? client.phoneNumber : "Empty")
            .setEmail(client.email !== null ? client.email : "Empty")
            .setDOB(client.dateOfBirth !== null ? new Date(client.dateOfBirth) : "Empty")
            .setPronouns(client.pronouns !== null ? client.pronouns : "Empty")
            .setSex(client.gender !== null ? client.gender : "Empty")
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

// TODO: MAKE THIS POST OBVIOUSLY 
app.get('/client', (req, res) => {
    let rawData = req.body.clientID;
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