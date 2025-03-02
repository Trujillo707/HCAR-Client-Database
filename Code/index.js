const express = require('express')
const app = express()
const path = require('path');
const port = 3000

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"public/index.html"))
});

app.post('/', (req, res) =>{
    res.render("test",{})
});

// THIS SHOULD NOT BE A GET PROBABLY MAYBE UNLESS???
app.get('/result', (req, res) => {
    res.render("results");
});

/* Port Number should be an environment variable fyi */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})