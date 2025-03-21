import express from 'express';
import session from 'express-session';
import mysql from 'promise-mysql';
import 'dotenv/config'
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, //Doesn't save every session, only modified ones.
    resave: false, //Avoids resaving of the session if it hasn't changed
    cookie: {
      maxAge: 86400000, //One day(miliseconds)
      secure: false, //Set to true in prod(Requires HTTPS for cookies to be set)
      httpOnly: true, //Disallows browser js from accessing cookie
    },
  })
);

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});

app.post('/api/auth', async (req, res) => {
  try{
    let validation = validateInput(req.body.username, req.body.password)
    if(!validation.status){
      return res.send(validation.message);
    }

    const pool = await createUnixSocketPool({ connectionLimit: 5 }); //Initializes connection to DB
    let query = "SELECT * FROM Account WHERE username = ?"; 
    const rows = await pool.query(query, [req.body.username]);

    if(rows.length == 0) res.send("Incorrect username or password"); //No user found
    else if(rows.length > 1){ //Should not happen
      console.log("Dangerous query");
      return res.send("Incorrect username or password");
    }
    else if(await bcrypt.compare(req.body.password, rows[0].hash)){
      req.session.accountID = rows[0].accountID;
      return res.send("Successful Login");
    }
    else{
        return res.send("Incorrect username or password");
    }
  }
  catch(err){
    console.log(err);
    return res.send("Error authenticating");
  }
});

const createUnixSocketPool = async config => {
  return mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: process.env.INSTANCE_UNIX_SOCKET
  });
};

function validateInput(username, password){
  if(!username || !password){
    return {"status": false, "message": "Empty username or password"};
  }
  else if(username.length > 32 || password.length > 32){
    return {"status": false, "message": "Input length exceeded"};
  }
  else if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
    return {"status": false, "message": "Username contains invalid characters"};
  }
  else{
    return {"status": true, "message": "Valid username/password input entered"};
  }
}