import express from "express"
const app = express()
import {reportTypes} from "./reportsLogic.js";
import {ClientBuilder} from "./objects/ClientBuilder.js";
const port = process.env.PORT || 3000;
import { fileURLToPath } from 'url';
import path from 'path';
import {testClientArray} from "./testData.js"
import QueryParser from "./objects/QueryParser.js";
import QueryParserBuilder from "./objects/QueryParserBuilder.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/public'));

// For handling form data
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/index.html"))
});

app.post('/home', (req, res) => {
    // After verification of credentials
    res.render("home");
});

// Clicking home from home will re-render the page
app.get('/home', (req, res) => {

    res.render("home");
});

app.get("/search", (req, res) => {
    res.render("search");
})

// TODO: MAKE THIS POST OBVIOUSLY
app.post('/results', (req, res) => {
    res.render("results", {clientList: testClientArray});
});

app.get("/reports", (req, res) => {
    res.render("reports", {availableReportsMap: reportTypes});
});

// TODO: MAKE THIS POST OBVIOUSLY 
app.get('/client', (req, res) => {
    let rawData = req.body.clientID;
    res.render("clientDetails", {theClient: testClientArray[0]});
});

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