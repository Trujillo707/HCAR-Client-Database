DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS File;
DROP TABLE IF EXISTS Staff;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Note;
DROP TABLE IF EXISTS Program;
DROP TABLE IF EXISTS Medication;
DROP TABLE IF EXISTS ContactInfo;
DROP TABLE IF EXISTS Insurance;
DROP TABLE IF EXISTS ProgramClient;
DROP TABLE IF EXISTS StaffClient;
DROP TABLE IF EXISTS NoteClient;

CREATE TABLE Client(
    CLIENTID INT AUTO_INCREMENT PRIMARY KEY, 
    fName VARCHAR(64), 
    lName VARCHAR(64), 
    address VARCHAR(64), 
    addressType VARCHAR(64), 
    city VARCHAR(64), 
    state CHAR(2), 
    zip VARCHAR(32), 
    dateOfBirth DATE, 
    phoneNumber VARCHAR(12), 
    phoneType VARCHAR(32), 
    sex VARCHAR(64), 
    greeting VARCHAR(64), 
    nickname VARCHAR(64), 
    maritalStatus INT, 
    religPref VARCHAR(64),
    payee VARCHAR(64),
    preferredHospital VARCHAR(64),
    likes VARCHAR(256),
    dislikes VARCHAR(256),
    goals VARCHAR(256),
    hobbies VARCHAR(256),
    achievements VARCHAR(256),
    conservator VARCHAR(64),
    primaryInsurance INT,
    secondaryInsurance INT,
    primaryCareProvider INT,
    primaryPhysician INT,
    profilePicture INT,
    FOREIGN KEY (primaryInsurance) REFERENCES Insurance(insuranceID),
    FOREIGN KEY (secondaryInsurance) REFERENCES Insurance(insuranceID),
    FOREIGN KEY (primaryCareProvider) REFERENCES ContactInfo(contactID),
    FOREIGN KEY (primaryPhysician) REFERENCES ContactInfo(contactID),
    FOREIGN KEY (profilePicture) REFERENCES File(fileID)
);

CREATE TABLE File(
    fileID INT AUTO_INCREMENT PRIMARY KEY, 
    filename VARCHAR(255) NOT NULL, 
    uploadDate DATETIME NOT NULL, 
    ClientID INT,
    FOREIGN KEY (ClientID) REFERENCES Client(CLIENTID)
);

CREATE TABLE Staff(
    staffID INT AUTO_INCREMENT PRIMARY KEY, 
    fName VARCHAR(64) NOT NULL, 
    lName VARCHAR(64) NOT NULL, 
    address VARCHAR(64),
    city VARCHAR(64), 
    state CHAR(2),
    phoneNumber VARCHAR(12) NOT NULL
);

CREATE TABLE Account(
    accountID INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(32) UNIQUE, 
    password VARCHAR(32), 
    admin BOOL,
    disabled BOOL,
    staffID INT, 
    FOREIGN KEY (staffID) REFERENCES Staff(staffID)
);

CREATE TABLE Note(
    noteID INT AUTO_INCREMENT PRIMARY KEY, 
    staffID INT, 
    dateCreated DATETIME, 
    content VARCHAR(2048),
    FOREIGN KEY (staffID) REFERENCES Staff(staffID)
);

CREATE TABLE Program(
    programID INT AUTO_INCREMENT PRIMARY KEY, 
    address VARCHAR(64) NOT NULL,
    city VARCHAR(64) NOT NULL, 
    state CHAR(2) NOT NULL,
    zip VARCHAR(9) NOT NULL,
    phoneNumber VARCHAR(12) NOT NULL
);

CREATE TABLE Medication(
    medicationID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64),
    description VARCHAR(256),
    dosage VARCHAR(64),
    frequency VARCHAR(64),
    fileID INT,
    clientID INT,
    FOREIGN KEY (fileID) REFERENCES File(fileID),
    FOREIGN KEY (clientID) REFERENCES Client(clientID)
);

CREATE TABLE ContactInfo(
    contactID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64),
    phoneNumber VARCHAR(12)
);

CREATE TABLE Insurance(
    insuranceID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64),
    policyNumber INT
);

CREATE TABLE ProgramClient(
    clientID INT, 
    programID INT,
    FOREIGN KEY (clientID) REFERENCES Client(clientID),
    FOREIGN KEY (programID) REFERENCES Program(programID)
);

CREATE TABLE StaffClient(
    accountID INT, 
    clientID INT,
    FOREIGN KEY (accountID) REFERENCES Account(accountID),
    FOREIGN KEY (clientID) REFERENCES Client(clientID)
);

CREATE TABLE NoteClient(
    noteID INT,
    clientID INT,
    FOREIGN KEY (noteID) REFERENCES Note(noteID),
    FOREIGN KEY (clientID) REFERENCES Client(clientID)
);