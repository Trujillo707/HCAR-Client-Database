--Inserts 5 Client records
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