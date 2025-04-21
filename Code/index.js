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
//Todo add email
app.get('/api/getAllClients', async (req, res) => {
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  try{
    const accountID = req.session.accountID;  
    if(accountID){
      const offset = ((req.query.pg && Number.isInteger(parseInt(req.query.pg))) ? (parseInt(req.query.pg)*10) : 0);
      const staffIDQuery = "SELECT staffID FROM Account WHERE accountID = ?";
      const rows = await pool.query(staffIDQuery, [accountID]);
      const staffID = rows[0].staffID;
  
      if(await isAdmin(accountID)){
        let clientQuery = "SELECT * FROM Client LIMIT 10 OFFSET ?";
        const rows = await pool.query(clientQuery, [offset]);
        return res.send(rows);
      }
      else{
        let clientQuery = "SELECT client.profilePicture, client.fName, client.lName, client.phoneNumber, client.dateOfBirth FROM Client client JOIN StaffClient sc ON client.clientID = sc.clientID WHERE sc.staffID = ?";
        const rows = await pool.query(clientQuery, [staffID]);
        return res.send(rows);
      }
    }
    else{
      return res.send({"Error": "Invalid authentication"});
    }
    
  }
  catch(err){
    console.log(err);
    return res.send({"Error": "Error retrieving users"});
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

    if(rows.length == 0) res.send({"Error":"Incorrect username or password"}); //No user found
    else if(rows.length > 1){ //Should not happen
      console.log("Dangerous query");
      return res.send({"Error":"Incorrect username or password"});
    }
    else if(await bcrypt.compare(req.body.password, rows[0].hash)){
      if(rows[0].disabled === 1){
        return res.send({"Error":"Account has been disabled"});
      }
      req.session.accountID = rows[0].accountID;
      return res.send("Successful Login");
    }
    else{
      return res.send({"Error":"Incorrect username or password"});
    }
  }
  catch(err){
    return res.send({"Error":"Error authenticating"});
  }
  finally{
    await pool.end();
  }
});

app.post('/api/createUser', async (req, res) => {
  try{
    if(await isAdmin(req.session.accountID)){
      await createUser(req.body.fName, req.body.lName, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.phoneNumber, req.body.username, req.body.password);
      return res.send("User created successfully");
    }
    else{
      return res.send({"Error":"Invalid permissions"});
    }
  }
  catch(err){
    return res.send({"Error":"Error creating user"});
  }
});

app.post('/api/createCaseNote', async (req, res) => {
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const accountID = req.session.accountID;
    if(accountID){
      let query = "SELECT staffID, disabled, admin FROM Account WHERE accountID = ?"; 
      const Account = await connection.query(query, [accountID]);
      if(Account[0].disabled === 1){
        return res.send({"Error":"Account has been disabled"});
      }
      const clientID = parseInt(req.body.clientID);
      if(!Number.isInteger(clientID)){
        return res.send({"Error":"Invalid Request"});
      }
      const staffID = Account[0].staffID;
      
      if(Account[0].admin != 1){
        const staffClientQuery = "SELECT COUNT(*) FROM StaffClient WHERE staffID = ? AND clientID = ?"; 
        var staffClient = await connection.query(staffClientQuery, [staffID, clientID]);
      }
      if(Account[0].admin === 1 || staffClient[0]['COUNT(*)'] === 1){
        const caseNoteCreationQuery = "INSERT INTO Note(staffID, dateCreated, content) VALUES (?, CURRENT_TIMESTAMP(), ?)"; 
        const caseNote = await connection.query(caseNoteCreationQuery, [staffID, req.body.content]);
        const noteID = caseNote.insertId;
        const noteClientCreationQuery = "INSERT INTO NoteClient(noteID, clientID) VALUES (?, ?)"; 
        const noteClient = await connection.query(noteClientCreationQuery, [noteID, clientID]);
        await connection.commit();
        return res.send("Case note successfully created");
      }
      else{
        return res.send({"Error":"User does not have access to this client"});
      }
    }
    else{
      return res.send({"Error":"Invalid authentication"});
    }
  }
  catch(err){
    await connection.rollback();
    return res.send({"Error":"Error creating casenote"});
  }
  finally{
    await connection.release();
    await pool.end();
  }
});


app.post('/api/v2/createCaseNote', async (req, res) => {
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const accountID = req.session.accountID;
    if(!accountID){
      return res.send({"Error":"User does not have access to this client"});
    }

    let query = "SELECT staffID, disabled, admin FROM Account WHERE accountID = ?"; 
    const Account = await connection.query(query, [accountID]);

    if(Account[0].disabled === 1){
      return res.send({"Error":"Account has been disabled"});
    }

    const clientID = parseInt(req.body.clientID);
    if(!Number.isInteger(clientID)){
      return res.send({"Error":"Invalid Request"});
    }
    const staffID = Account[0].staffID;
    
    if(Account[0].admin != 1){
      const staffClientQuery = "SELECT COUNT(*) FROM StaffClient WHERE staffID = ? AND clientID = ?"; 
      var staffClient = await connection.query(staffClientQuery, [staffID, clientID]);
    }
    if(Account[0].admin === 1 || staffClient[0]['COUNT(*)'] === 1){
      await connection.query("CALL CreateCaseNote(?, ?, ?, ?, ?, ?, ?)", [
        staffID,
        clientID,
        req.body.contactType,
        req.body.goal,
        req.body.goalProgress,
        req.body.narrative,
        req.body.nextSteps
      ]);
      await connection.commit();
      return res.send("Case note successfully created"); 
    }
    else{
      return res.send({"Error":"Invalid authentication"});
    }
  }
  catch(err){
    await connection.rollback();
    return res.send({"Error":"Error creating casenote"});
  }
  finally{
    await connection.release();
    await pool.end();
  }
});


//toDo procedure
app.post('/api/deleteCaseNote', async (req, res) => {
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const accountID = req.session.accountID;
    if(accountID){
      let query = "SELECT staffID, disabled, admin FROM Account WHERE accountID = ?"; 
      const Account = await connection.query(query, [accountID]);
      if(Account[0].disabled === 1){
        return res.send({"Error":"Account has been disabled"});
      }
      const noteID = parseInt(req.body.noteID);
      const clientID = parseInt(req.body.clientID);

      if(!Number.isInteger(clientID) || !Number.isInteger(noteID)){
        return res.send({"Error":"Invalid Request"});
      }

      const staffID = Account[0].staffID;
      
      if(Account[0].admin != 1){
        const staffClientQuery = "SELECT COUNT(*) FROM StaffClient WHERE staffID = ? AND clientID = ?"; 
        var staffClient = await connection.query(staffClientQuery, [staffID, clientID]);
      }
      if(Account[0].admin === 1 || staffClient[0]['COUNT(*)'] === 1){
        const NoteClientDeletionQuery = "DELETE FROM NoteClient WHERE noteID = ? AND clientID = ?"; 
        const noteCient = await connection.query(NoteClientDeletionQuery, [noteID, clientID]);

        const NoteDeletionQuery = "DELETE FROM Note WHERE noteID = ?"; 
        const note = await connection.query(NoteDeletionQuery, [noteID]);
        await connection.commit();
        return res.send("Case note successfully deleted");
      }
      else{
        return res.send({"Error":"User does not have access to this client"});
      }
    }
    else{
      return res.send({"Error":"Invalid authentication"});
    }
  }
  catch(err){
    await connection.rollback();
    return res.send({"Error":"Error creating casenote"});
  }
  finally{
    await connection.release();
    await pool.end();
  }
});

app.get('/api/modifyCaseNote', async (req, res) => {
  
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
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
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

/*
async function isAuthenticated(accountID){
  const pool = await createTcpPool({ connectionLimit: 5 }); //Initializes connection to DB
  try{
    let query = "SELECT disabled FROM Account WHERE accountID = ?"; 
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
*/
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


async function createUser(fName, lName, address, city, state, zip, phoneNumber, username, password){
  const pool = await createTcpPool({ connectionLimit: 5 });
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const accountQuery = "INSERT INTO Account(username, hash, admin, disabled) VALUES(?, ?, ?, ?)";
    const accountResponse = await connection.query(accountQuery, [username, hash, 0, 0]);
    const accountId = accountResponse.insertId;
    console.log(accountId);

    const staffQuery = "INSERT INTO Staff (fName, lName, address, city, state, zip, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const staffResponse = await connection.query(staffQuery, [fName, lName, address, city, state, zip, phoneNumber]);
    const staffId = staffResponse.insertId;
    console.log(staffId);
    const updateAccountQuery = "UPDATE Account SET staffID = ? WHERE accountID = ?";
    await connection.query(updateAccountQuery, [staffId, accountId]);

    await connection.commit();
    console.log("Successful user creation");
    return true;
  } catch (err) {
    await connection.rollback();
    console.error('Error creating user:', err.sqlMessage);
    return false;
  } finally {
    await connection.release();
  }
}

const createTcpPool = async config => {
  const dbConfig = {
    host: process.env.INSTANCE_HOST, // e.g. '127.0.0.1'
    port: process.env.DB_PORT, // e.g. '3306'
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
  };
  return mysql.createPool(dbConfig);
};