const express = require('express')
const app = express()
const path = require('path');
const {reportTypes} = require("./reportsLogic");
const {ClientBuilder} = require("./ClientBuilder.js");
const port = process.env.PORT || 3000;

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
app.get('/result', (req, res) => {
    let foo = [];
    foo.push(new ClientBuilder()
        .setFirstName("Alice")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Bob")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Cam")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Danny")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Edward")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Fred")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Harry")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("Isaac")
        .setLastName("Auger")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setEmail("alice@foobar.com")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());
    foo.push(new ClientBuilder()
        .setFirstName("James")
        .setLastName("Auger")
        .setPronouns("She/Her")
        .setDOB(new Date("2000-06-06"))
        .setSex("Female")
        .setPhoneNumber("707-777-7777")
        .setPrograms(["Bay Center", "Clinical Services"])
        .build());

    let bar = []

    res.render("results", {clientList: foo});
});

app.get("/reports", (req, res) => {
    res.render("reports", {availableReportsMap: reportTypes});
});

app.post('/client', (req, res) => {
    let rawData = req.body.clientID;
    res.render("clientDetails", {client: getClientDetails()});
});

/* Port Number should be an environment variable fyi */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})