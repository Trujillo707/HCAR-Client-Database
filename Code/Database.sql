```sql
CREATE TABLE Client(
CLIENTID int AUTO_INCREMENT PRIMARY KEY, 
fName varchar(64), 
lName varchar(64), 
address varchar(64), 
addressType varchar(64), 
city varchar(64), 
state varchar(32), 
zip varchar(32), 
birthdate DATE, 
phoneNumber varchar(32), 
phoneType varchar(32), 
age int, 
sex varchar(64), 
greeting varchar(64), 
nickname varchar(64), 
maritalStatus varchar(32), 
religPref varchar(32)
);

CREATE TABLE File(
fileID int AUTO_INCREMENT PRIMARY KEY, 
filename varchar(255) NOT NULL, 
uploadDate DATETIME NOT NULL, 
ClientID int,
foreign key (ClientID) references Client(CLIENTID)
);


CREATE TABLE Staff(
staffID int AUTO_INCREMENT PRIMARY KEY, 
fName varchar(64) NOT NULL, 
lName varchar(64) NOT NULL, 
address varchar(64),
city varchar(64), 
state varchar(32),
phoneNumber varchar(32) NOT NULL
);

CREATE TABLE Account(
accountID int AUTO_INCREMENT PRIMARY KEY, 
username varchar(64) UNIQUE, 
password varchar(256), 
disabled BOOL,
staffID int, 
foreign key (staffID) references Staff(staffID)
);

CREATE TABLE Note(
noteID int AUTO_INCREMENT PRIMARY KEY, 
staffID int, 
dateCreated DATETIME, 
content varchar(2048),
foreign key (staffID) references Staff(staffID)
);

CREATE TABLE Program(
programID int AUTO_INCREMENT PRIMARY KEY, 
address varchar(64) NOT NULL,
city varchar(64) NOT NULL, 
state varchar(32) NOT NULL,
phoneNumber varchar(32) NOT NULL
);

CREATE TABLE ProgramClient(
clientID int, 
programID int,
foreign key (clientID) references Client(clientID),
foreign key (programID) references Program(programID)
);

CREATE TABLE StaffClient(
accountID int, 
clientID int,
foreign key (accountID) references Account(accountID),
foreign key (clientID) references Client(clientID)
);

CREATE TABLE NoteClient(
noteID int,
clientID int,
foreign key (noteID) references Note(noteID),
foreign key (clientID) references Client(clientID)
);
```
