SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS NoteClient;
DROP TABLE IF EXISTS ProgramClient;
DROP TABLE IF EXISTS StaffClient;
DROP TABLE IF EXISTS Medication;
DROP TABLE IF EXISTS Note;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS File;
DROP TABLE IF EXISTS Program;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Staff;
DROP TABLE IF EXISTS ContactInfo;
DROP TABLE IF EXISTS Insurance;
SET FOREIGN_KEY_CHECKS = 1;


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

CREATE TABLE Program(
    programID INT AUTO_INCREMENT PRIMARY KEY, 
    address VARCHAR(64) NOT NULL,
    city VARCHAR(64) NOT NULL, 
    state CHAR(2) NOT NULL,
    zip VARCHAR(9) NOT NULL,
    phoneNumber VARCHAR(12) NOT NULL
);

CREATE TABLE Staff(
    staffID INT AUTO_INCREMENT PRIMARY KEY, 
    fName VARCHAR(64) NOT NULL, 
    lName VARCHAR(64) NOT NULL, 
    address VARCHAR(64),
    city VARCHAR(64), 
    state CHAR(2),
    zip VARCHAR(9),
    phoneNumber VARCHAR(12) NOT NULL
);

CREATE TABLE Account(
    accountID INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(32) UNIQUE, 
    hash VARCHAR(128), 
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

CREATE TABLE Client(
    clientID INT AUTO_INCREMENT PRIMARY KEY, 
    fName VARCHAR(64), 
    lName VARCHAR(64), 
    email VARCHAR(64),
    address VARCHAR(64), 
    addressType VARCHAR(64), 
    city VARCHAR(64), 
    state CHAR(2), 
    zip VARCHAR(32), 
    dateOfBirth DATE, 
    phoneNumber VARCHAR(12), 
    phoneType VARCHAR(32), 
    sex VARCHAR(64), 
    gender VARCHAR(64),
    pronouns VARCHAR(64),
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
    profilePicture INT
);

CREATE TABLE File(
    fileID INT AUTO_INCREMENT PRIMARY KEY, 
    filename VARCHAR(255) NOT NULL, 
    uploadDate DATETIME NOT NULL, 
    ClientID INT
);

CREATE TABLE Medication(
    medicationID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64),
    description VARCHAR(256),
    dosage VARCHAR(64),
    frequency VARCHAR(64),
    fileID INT,
    clientID INT
);

CREATE TABLE ProgramClient(
    clientID INT, 
    programID INT
);

CREATE TABLE StaffClient(
    staffID INT, 
    clientID INT
);

CREATE TABLE NoteClient(
    noteID INT,
    clientID INT
);

ALTER TABLE Client 
ADD CONSTRAINT fk_client_primaryInsurance FOREIGN KEY (primaryInsurance) REFERENCES Insurance(insuranceID),
ADD CONSTRAINT fk_client_secondaryInsurance FOREIGN KEY (secondaryInsurance) REFERENCES Insurance(insuranceID),
ADD CONSTRAINT fk_client_primaryCareProvider FOREIGN KEY (primaryCareProvider) REFERENCES ContactInfo(contactID),
ADD CONSTRAINT fk_client_primaryPhysician FOREIGN KEY (primaryPhysician) REFERENCES ContactInfo(contactID),
ADD CONSTRAINT fk_client_profilePicture FOREIGN KEY (profilePicture) REFERENCES File(fileID);

ALTER TABLE File 
ADD CONSTRAINT fk_file_client FOREIGN KEY (ClientID) REFERENCES Client(CLIENTID);

ALTER TABLE Medication 
ADD CONSTRAINT fk_medication_file FOREIGN KEY (fileID) REFERENCES File(fileID),
ADD CONSTRAINT fk_medication_client FOREIGN KEY (clientID) REFERENCES Client(clientID);

ALTER TABLE ProgramClient 
ADD CONSTRAINT fk_programClient_client FOREIGN KEY (clientID) REFERENCES Client(clientID),
ADD CONSTRAINT fk_programClient_program FOREIGN KEY (programID) REFERENCES Program(programID);

ALTER TABLE StaffClient 
ADD CONSTRAINT fk_staffClient_staff FOREIGN KEY (staffID) REFERENCES Staff(staffID),
ADD CONSTRAINT fk_staffClient_client FOREIGN KEY (clientID) REFERENCES Client(clientID);

ALTER TABLE NoteClient 
ADD CONSTRAINT fk_noteClient_note FOREIGN KEY (noteID) REFERENCES Note(noteID),
ADD CONSTRAINT fk_noteClient_client FOREIGN KEY (clientID) REFERENCES Client(clientID);
