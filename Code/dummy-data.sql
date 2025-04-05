INSERT INTO Staff(staffID, fName, lName, address, city, state, zip, phoneNumber) VALUES
('1', 'Alba', 'Heller', '48521 Mraz Throughway', 'Hammesburgh', 'CA', '95519', '7071234567'),
('2', 'Lonzo', 'Volkman', '6904 Ali Street', 'Devontefurt', 'CA', '95229', '7071236724'),
('3', 'Jake', 'Mayer', '7743 Carmella Loaf', 'West Rickfort', 'CA', '95119', '7071231091'),
('4', 'Fleta', 'Pfeffer', '990 Washington Road', 'Volkmanboro', 'CA', '97519', '7071230000'),
('5', 'Fay', 'Schaefer', '52398 Walsh Turnpike', 'Leuschkeborough', 'CA', '95919', '7071232222');
	
INSERT INTO Account(accountID, username, hash, admin, disabled, staffID) VALUES
('1', 'TestUser', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '1'),
('2', 'TestUser2', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '2'), 
('3', 'TestUser3', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '1', '3'),
('4', 'TestUser4', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '4'),
('5', 'TestUser5', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '5');

INSERT INTO Client (
    fName, lName, address, addressType, city, state, zip,
    dateOfBirth, phoneNumber, phoneType, sex, greeting, nickname,
    maritalStatus, religPref, payee, preferredHospital, likes, dislikes,
    goals, hobbies, achievements, conservator
)
VALUES
('John', 'Doe', '123 Main St', 'Home', 'Anytown', 'NY', '12345',
 '1980-01-01', '555-1234', 'Mobile', 'M', 'Hello', 'Johnny',
 0, 'None', 'None', 'General Hospital', 'Pizza', 'Traffic',
 'Succeed', 'Reading', 'None', 'None'),
('Jane', 'Smith', '456 Oak Ave', 'Home', 'Othertown', 'CA', '67890',
 '1990-05-15', '555-5678', 'Work', 'F', 'Hi', 'Janie',
 1, 'Christianity', 'None', 'City Hospital', 'Pasta', 'Crowds',
 'Accomplish', 'Cooking', 'None', 'None'),
('Alice', 'Johnson', '789 Pine Rd', 'Apartment', 'Elsewhere', 'TX', '54321',
 '1975-03-20', '555-9012', 'Home', 'F', 'Hey', 'Ally',
 2, 'None', 'None', 'County Hospital', 'Reading', 'Noise',
 'Calm', 'Gardening', 'None', 'None'),
('Robert', 'Brown', '321 Elm St', 'Home', 'Sometown', 'FL', '11111',
 '1985-07-07', '555-0000', 'Mobile', 'M', 'Hello', 'Rob',
 0, 'None', 'None', 'S. Hospital', 'Burgers', 'Noise',
 'Prosper', 'Swimming', 'None', 'None'),
('Emily', 'Davis', '654 Maple Ave', 'Apartment', 'Newtown', 'IL', '22222',
 '1992-11-22', '555-1111', 'Work', 'F', 'Hi there', 'Em',
 1, 'None', 'None', 'City Hospital', 'Salads', 'Crowds',
 'Excel', 'Running', 'None', 'None');

-- Create StaffClient associations linking the clients to staff
INSERT INTO StaffClient (staffID, clientID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4),
(1, 5);

INSERT INTO File (filename, uploadDate, ClientID)
VALUES
('client1_file.png', NOW(), 1),
('client2_file.png', NOW(), 2),
('client3_file.png', NOW(), 3),
('client4_file.png', NOW(), 4),
('client5_file.png', NOW(), 5);

UPDATE Client 
SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 1) 
WHERE CLIENTID = 1;

UPDATE Client 
SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 2) 
WHERE CLIENTID = 2;

UPDATE Client 
SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 3) 
WHERE CLIENTID = 3;

UPDATE Client 
SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 4) 
WHERE CLIENTID = 4;

UPDATE Client 
SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 5) 
WHERE CLIENTID = 5;