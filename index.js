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
      sameSite: 'strict', //CSRF Protection
    },
  })
);

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});

/*
  /api/getAllClients

  Purpose:
    Returns limited info for each client associated with currently logged in user.
    Returns limited info for all clients if currently logged in user is admin

  TODO: Change SQL statements to select fewer columns instead of client.*
*/
app.get('/api/getAllClients', async (req, res) => {
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  try{
    const accountID = req.session.accountID;
    if(accountID){
      const staffIDQuery = "SELECT staffID FROM Account WHERE accountID = ?";
      const rows = await pool.query(staffIDQuery, [accountID]);
      const staffID = rows[0].staffID;
  
      if(await isAdmin(accountID)){
        let clientQuery = "SELECT client.* FROM Client client";
        const rows = await pool.query(clientQuery);
        return res.send(rows);
      }
      else{
        let clientQuery = "SELECT client.* FROM Client client JOIN StaffClient sc ON client.clientID = sc.clientID WHERE sc.staffID = ?";
        const rows = await pool.query(clientQuery, [staffID]);
        return res.send(rows);
      }
    }
    else{
      return res.send("Invalid authentication");
    }
  }
  catch(err){
    return res.send("Error retrieving users");
  }
  finally{
    await pool.end();
  }
});

/*
  /api/auth

  Purpose:
    Receives username and password combo and authenticates user session if credentials are valid.
*/

app.post('/api/auth', async (req, res) => {
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  try{
    let validation = validateInput(req.body.username, req.body.password)
    if(!validation.status) return res.send(validation.message);

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
    return res.send("Error authenticating");
  }
  finally{
    await pool.end();
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

/*
Checks if a provided accountID is admin.
This is useful in determining if the user should be able to execute certain operations.
*/
async function isAdmin(accountID){
  const pool = await createUnixSocketPool({ connectionLimit: 5 }); //Initializes connection to DB
  try{
    let query = "SELECT admin FROM Account WHERE accountID = ?"; 
    const Account = await pool.query(query, [accountID]);
    return Account[0].admin === 1;
  }
  catch(err){
    return false;
  }
  finally{
    await pool.end();
  }
}

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
