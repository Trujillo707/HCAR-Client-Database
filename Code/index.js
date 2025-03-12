const express = require('express')
const app = express()
const path = require('path');
const {reportTypes} = require("./reportsLogic");
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

// For handling form data
app.use(express.urlencoded( {extended: true} ));

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"public/index.html"))
});

app.post('/tohome', (req, res) => {
    // After verification of credentials
    res.render("home");
});

// Clicking home from home will re-render the page
app.get('/tohome', (req, res) => {
    
    res.render("home");
});

app.get("/search", (req, res) =>{
    res.render("search");
})

// THIS SHOULD NOT BE A GET PROBABLY MAYBE UNLESS???
app.get('/result', (req, res) => {
    // TODO: put logic here obviously
    res.render("results");
});

app.get("/reports", (req, res) =>{
    res.render("reports", {availableReportsMap: reportTypes});
})

/* Port Number should be an environment variable fyi */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})