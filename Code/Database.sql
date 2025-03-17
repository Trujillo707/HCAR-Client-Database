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
    foreign key (primaryInsurance) references Insurance(insuranceID),
    foreign key (secondaryInsurance) references Insurance(insuranceID),
    foreign key (primaryCareProvider) references ContactInfo(contactID),
    foreign key (primaryPhysician) references ContactInfo(contactID),
    foreign key (profilePicture) references File(fileID)
);

CREATE TABLE File(
    fileID INT AUTO_INCREMENT PRIMARY KEY, 
    filename VARCHAR(255) NOT NULL, 
    uploadDate DATETIME NOT NULL, 
    ClientID INT,
    foreign key (ClientID) references Client(CLIENTID)
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
    foreign key (staffID) references Staff(staffID)
);

CREATE TABLE Note(
    noteID INT AUTO_INCREMENT PRIMARY KEY, 
    staffID INT, 
    dateCreated DATETIME, 
    content VARCHAR(2048),
    foreign key (staffID) references Staff(staffID)
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
    foreign key (fileID) references File(fileID),
    foreign key (clientID) references Client(clientID)
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
    foreign key (clientID) references Client(clientID),
    foreign key (programID) references Program(programID)
);

CREATE TABLE StaffClient(
    accountID INT, 
    clientID INT,
    foreign key (accountID) references Account(accountID),
    foreign key (clientID) references Client(clientID)
);

CREATE TABLE NoteClient(
    noteID INT,
    clientID INT,
    foreign key (noteID) references Note(noteID),
    foreign key (clientID) references Client(clientID)
);