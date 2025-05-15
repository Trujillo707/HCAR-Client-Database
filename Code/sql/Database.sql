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
DROP PROCEDURE IF EXISTS CreateCaseNote;
DROP PROCEDURE IF EXISTS DeleteCaseNote;
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
    phoneNumber VARCHAR(12) NOT NULL,
    name VARCHAR(32) NOT NULL
);

CREATE TABLE Staff(
    staffID INT AUTO_INCREMENT PRIMARY KEY, 
    fName VARCHAR(64) NOT NULL, 
    mName VARCHAR(64), 
    lName VARCHAR(64) NOT NULL, 
    address VARCHAR(64),
    city VARCHAR(64), 
    state CHAR(2),
    zip VARCHAR(9),
    phoneNumber VARCHAR(12) NOT NULL
);

CREATE TABLE Account(
    accountID INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(32) NOT NULL UNIQUE, 
    hash VARCHAR(128) NOT NULL, 
    admin BOOL,
    disabled BOOL,
    staffID INT, 
    FOREIGN KEY (staffID) REFERENCES Staff(staffID) ON DELETE CASCADE
);

CREATE TABLE Note(
    noteID INT AUTO_INCREMENT PRIMARY KEY, 
    staffID INT, 
    dateCreated DATETIME NOT NULL, 
    dateModified DATETIME,
    contactType ENUM('In-Person', 'Written', 'Over the Phone') NOT NULL,
    goal ENUM('ISP Goal', 'IPP Goal', 'Personal Goal') NOT NULL,
    goalProgress VARCHAR(2048),
    narrative VARCHAR(2048),
    nextSteps VARCHAR(2048),
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
    programID INT,
    PRIMARY KEY (clientID, programID)
);

CREATE TABLE StaffClient(
    staffID INT, 
    clientID INT,
    title VARCHAR(64),
    dateAssigned DATE,
    dateRemoved DATE,
    PRIMARY KEY (staffID, clientID)
);

CREATE TABLE NoteClient(
    noteID INT,
    clientID INT,
    PRIMARY KEY (noteID, clientID)
);

ALTER TABLE Vaccination
ADD CONSTRAINT vaccination_Client_clientID_fk FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE;

ALTER TABLE Client 
ADD CONSTRAINT fk_client_primaryInsurance FOREIGN KEY (primaryInsurance) REFERENCES Insurance(insuranceID) ON DELETE CASCADE,
ADD CONSTRAINT fk_client_secondaryInsurance FOREIGN KEY (secondaryInsurance) REFERENCES Insurance(insuranceID) ON DELETE CASCADE,
ADD CONSTRAINT fk_client_primaryCareProvider FOREIGN KEY (primaryCareProvider) REFERENCES ContactInfo(contactID) ON DELETE CASCADE,
ADD CONSTRAINT fk_client_primaryPhysician FOREIGN KEY (primaryPhysician) REFERENCES ContactInfo(contactID) ON DELETE CASCADE,
ADD CONSTRAINT fk_client_profilePicture FOREIGN KEY (profilePicture) REFERENCES File(fileID) ON DELETE CASCADE;

ALTER TABLE File 
ADD CONSTRAINT fk_file_client FOREIGN KEY (ClientID) REFERENCES Client(CLIENTID) ON DELETE CASCADE;

ALTER TABLE Medication 
ADD CONSTRAINT fk_medication_file FOREIGN KEY (fileID) REFERENCES File(fileID),
ADD CONSTRAINT fk_medication_client FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE;

ALTER TABLE ProgramClient 
ADD CONSTRAINT fk_programClient_client FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE,
ADD CONSTRAINT fk_programClient_program FOREIGN KEY (programID) REFERENCES Program(programID);

ALTER TABLE StaffClient 
ADD CONSTRAINT fk_staffClient_staff FOREIGN KEY (staffID) REFERENCES Staff(staffID) ON DELETE CASCADE,
ADD CONSTRAINT fk_staffClient_client FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE;

ALTER TABLE NoteClient 
ADD CONSTRAINT fk_noteClient_note FOREIGN KEY (noteID) REFERENCES Note(noteID),
ADD CONSTRAINT fk_noteClient_client FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE;

DELIMITER $$

CREATE PROCEDURE CreateCaseNote(
  IN in_staffID INT,
  IN in_clientID INT,
  IN in_contactType VARCHAR(30),
  IN in_goal VARCHAR(30),
  IN in_goalProgress VARCHAR(2048),
  IN in_narrative VARCHAR(2048),
  IN in_nextSteps VARCHAR(2048),
  IN in_subject VARCHAR(2048),
  IN in_signoffDate DATE,
  IN in_eventDate DATE,
  IN in_program VARCHAR(2048)
)
BEGIN
  DECLARE newNoteID INT;
  DECLARE progID    INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    -- Rollback if there's any SQL error
    ROLLBACK;
    RESIGNAL;
  END;

  -- Check 
  IF in_contactType NOT IN ('In-Person', 'Written', 'Over the Phone') THEN
	  SIGNAL SQLSTATE '45000'
	  SET MESSAGE_TEXT = 'Invalid contact type';
	END IF;
    
  IF in_goal NOT IN ('ISP Goal', 'IPP Goal', 'Personal Goal') THEN
		SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid goal type';
	END IF;
    
  -- Get Program ID
  select programID INTO progID
  from Program
  where name = in_program;
    
  -- Check programID not null
  IF progID IS NULL THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Program not found';
	END IF;

  START TRANSACTION;

  -- Insert into Note
  INSERT INTO Note (
    staffID,
    dateCreated,
    contactType,
    goal,
    goalProgress,
    narrative,
    nextSteps
  ) VALUES (
    in_staffID,
    CURRENT_TIMESTAMP(),
    in_contactType,
    in_goal,
    in_goalProgress,
    in_narrative,
    in_nextSteps
  );

  -- Get the new note ID
  SET newNoteID = LAST_INSERT_ID();

  -- Insert into NoteClient
  INSERT INTO NoteClient (noteID, clientID) VALUES (newNoteID, in_clientID);

  -- COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeleteCaseNote(
    IN in_clientID INT,
    IN in_noteID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback if there's any SQL error
        ROLLBACK;
        RESIGNAL;
    END;

    -- START TRANSACTION;
    
    -- Delete from NoteClient
    DELETE FROM NoteClient WHERE NoteID = in_noteID AND ClientID = in_clientID;

    -- Delete from NOTE
    DELETE FROM Note WHERE NoteID = in_noteID;

    -- COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DeleteClient(
  IN in_clientID INT
)
BEGIN
  DECLARE v_primaryInsurance       INT;
  DECLARE v_secondaryInsurance     INT;
  DECLARE v_primaryCareProvider    INT;
  DECLARE v_primaryPhysician       INT;
  DECLARE v_profilePicture         INT;
  
  -- on any SQL error, rollback and re‑raise
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
  
  -- grab all the foreign key IDs
  SELECT
    primaryInsurance,
    secondaryInsurance,
    primaryCareProvider,
    primaryPhysician,
    profilePicture
  INTO
    v_primaryInsurance,
    v_secondaryInsurance,
    v_primaryCareProvider,
    v_primaryPhysician,
    v_profilePicture
  FROM Client
  WHERE clientID = in_clientID;
  
  -- delete each if present
  IF v_primaryInsurance IS NOT NULL THEN
    DELETE FROM Insurance
     WHERE insuranceID = v_primaryInsurance;
  END IF;
  
  IF v_secondaryInsurance IS NOT NULL THEN
    DELETE FROM Insurance
     WHERE insuranceID = v_secondaryInsurance;
  END IF;
  
  IF v_primaryCareProvider IS NOT NULL THEN
    DELETE FROM ContactInfo
     WHERE contactID = v_primaryCareProvider;
  END IF;
  
  IF v_primaryPhysician IS NOT NULL THEN
    DELETE FROM ContactInfo
     WHERE contactID = v_primaryPhysician;
  END IF;
  
  -- if you store profile pictures in a File table:
  IF v_profilePicture IS NOT NULL THEN
    DELETE FROM File
     WHERE fileID = v_profilePicture;
  END IF;
  
  -- now finally delete the client row
  DELETE FROM Client
   WHERE clientID = in_clientID;
  
  COMMIT;
END $$

DELIMITER ;