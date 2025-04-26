INSERT INTO Staff(staffID, fName, lName, address, city, state, zip, phoneNumber) VALUES
('1', 'Alba', 'Heller', '48521 Mraz Throughway', 'Hammesburgh', 'CA', '95519', '7071234567'),
('2', 'Lonzo', 'Volkman', '6904 Ali Street', 'Devontefurt', 'CA', '95229', '7071236724'),
('3', 'Jake', 'Mayer', '7743 Carmella Loaf', 'West Rickfort', 'CA', '95119', '7071231091'),
('4', 'Fleta', 'Pfeffer', '990 Washington Road', 'Volkmanboro', 'CA', '97519', '7071230000'),
('5', 'Fay', 'Schaefer', '52398 Walsh Turnpike', 'Leuschkeborough', 'CA', '95919', '7071232222');
	
INSERT INTO Account(accountID, username, hash, admin, disabled, staffID) VALUES
('1', 'TestUser', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '1', '0', '1'),
('2', 'TestUser2', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '2'), 
('3', 'TestUser3', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '1', '3'),
('4', 'TestUser4', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '4'),
('5', 'TestUser5', '$2b$10$9VV43ciXdrXYIP8k/uAXDunq8JVdCqcgzMMRWxwXUJAbQiK6e0.5C', '0', '0', '5');

INSERT INTO Client (
    fName, lName, address, addressType, city, state, zip,
    dateOfBirth, phoneNumber, phoneType, sex, gender, pronouns,
    greeting, nickname, maritalStatus, religPref, payee, preferredHospital,
    likes, dislikes, goals, hobbies, achievements, conservator
)
VALUES
-- Clients 1-5
('John', 'Doe', '123 Main St', 'Home', 'Anytown', 'NY', '12345', '1980-01-01', '555-1234', 'Mobile', 'M', 'Male', 'he/him', 'Hello', 'Johnny', 0, 'None', 'None', 'General Hospital', 'Pizza', 'Traffic', 'Succeed', 'Reading', 'None', 'None'),
('Jane', 'Smith', '456 Oak Ave', 'Home', 'Othertown', 'CA', '67890', '1990-05-15', '555-5678', 'Work', 'F', 'Female', 'she/her', 'Hi', 'Janie', 1, 'Christianity', 'None', 'City Hospital', 'Pasta', 'Crowds', 'Accomplish', 'Cooking', 'None', 'None'),
('Alice', 'Johnson', '789 Pine Rd', 'Apartment', 'Elsewhere', 'TX', '54321', '1975-03-20', '555-9012', 'Home', 'F', 'Female', 'she/her', 'Hey', 'Ally', 2, 'None', 'None', 'County Hospital', 'Reading', 'Noise', 'Calm', 'Gardening', 'None', 'None'),
('Robert', 'Brown', '321 Elm St', 'Home', 'Sometown', 'FL', '11111', '1985-07-07', '555-0000', 'Mobile', 'M', 'Male', 'he/him', 'Hello', 'Rob', 0, 'None', 'None', 'S. Hospital', 'Burgers', 'Noise', 'Prosper', 'Swimming', 'None', 'None'),
('Emily', 'Davis', '654 Maple Ave', 'Apartment', 'Newtown', 'IL', '22222', '1992-11-22', '555-1111', 'Work', 'F', 'Female', 'she/her', 'Hi there', 'Em', 1, 'None', 'None', 'City Hospital', 'Salads', 'Crowds', 'Excel', 'Running', 'None', 'None'),

-- Clients 6-10
('Mark', 'Wilson', '100 Cedar St', 'Home', 'Lakeview', 'WI', '33333', '1988-04-04', '555-2222', 'Mobile', 'M', 'Male', 'he/him', 'Hey there', 'Marky', 0, 'None', 'None', 'Community Hospital', 'Tacos', 'Cold', 'Grow', 'Fishing', 'None', 'None'),
('Laura', 'Lee', '200 Birch St', 'Apartment', 'Springfield', 'MO', '44444', '1979-09-09', '555-3333', 'Work', 'F', 'Female', 'she/her', 'Hiya', 'Laur', 1, 'Buddhism', 'None', 'Hope Hospital', 'Rice', 'Noise', 'Balance', 'Yoga', 'None', 'None'),
('Chris', 'Martinez', '300 Chestnut Blvd', 'Home', 'Mountainville', 'CO', '55555', '1995-12-12', '555-4444', 'Mobile', 'M', 'Non-binary', 'they/them', 'Sup', 'Chrisy', 0, 'Atheism', 'None', 'Valley Hospital', 'Wings', 'Heat', 'Win', 'Gaming', 'None', 'None'),
('Sara', 'Nguyen', '400 Spruce Ln', 'Apartment', 'Greenwood', 'OR', '66666', '1993-02-02', '555-5555', 'Work', 'F', 'Female', 'she/her', 'Hola', 'Sar', 1, 'None', 'None', 'Pine Hospital', 'Pho', 'Rain', 'Peace', 'Knitting', 'None', 'None'),
('David', 'Kim', '500 Redwood Dr', 'Home', 'Seaside', 'WA', '77777', '1987-06-06', '555-6666', 'Home', 'M', 'Male', 'he/him', 'Yo', 'Davy', 2, 'Christianity', 'None', 'Sunset Hospital', 'Soup', 'Crowds', 'Learn', 'Surfing', 'None', 'None'),

-- Clients 11-15
('Grace', 'Patel', '600 Palm Ave', 'Apartment', 'Riverdale', 'AZ', '88888', '1991-08-08', '555-7777', 'Mobile', 'Female', 'Non-binary', 'they/them', 'Howdy', 'Gracie', 0, 'Hinduism', 'None', 'River Hospital', 'Bread', 'Fire', 'Achieve', 'Drawing', 'None', 'None'),
('Brian', 'Young', '700 Willow Way', 'Home', 'Westview', 'NV', '99999', '1982-03-03', '555-8888', 'Work', 'M', 'Male', 'he/him', 'Greetings', 'Bri', 1, 'None', 'None', 'West Hospital', 'Meat', 'Dark', 'Build', 'Woodworking', 'None', 'None'),
('Hannah', 'Lopez', '800 Fir Ct', 'Apartment', 'Sunnytown', 'UT', '10101', '1996-07-07', '555-9999', 'Home', 'F', 'Female', 'she/her', 'Heyo', 'Han', 0, 'Islam', 'None', 'Hope Hospital', 'Curry', 'Cold', 'Shine', 'Dancing', 'None', 'None'),
('Ethan', 'Clark', '900 Beech St', 'Home', 'Eastville', 'NM', '20202', '1983-01-01', '555-1212', 'Mobile', 'M', 'Male', 'he/him', 'Yo', 'E', 2, 'None', 'None', 'East Hospital', 'Pizza', 'Heat', 'Win', 'Basketball', 'None', 'None'),
('Olivia', 'Adams', '1010 Sycamore Blvd', 'Apartment', 'Foresthill', 'MT', '30303', '1999-10-10', '555-3434', 'Work', 'F', 'Female', 'she/her', 'Hello', 'Liv', 1, 'None', 'None', 'Forest Hospital', 'Salads', 'Crowds', 'Flourish', 'Skiing', 'None', 'None'),

-- Clients 16-20
('Noah', 'Baker', '1111 Hemlock Rd', 'Home', 'Rivertown', 'ME', '40404', '1984-05-05', '555-4545', 'Home', 'M', 'Male', 'he/him', 'Hey', 'N', 0, 'None', 'None', 'Riverside Hospital', 'Stew', 'Noise', 'Grow', 'Rowing', 'None', 'None'),
('Sophia', 'Perez', '1212 Walnut Ave', 'Apartment', 'Brookvale', 'MA', '50505', '1997-11-11', '555-5656', 'Mobile', 'F', 'Female', 'she/her', 'Hiya', 'Sophie', 1, 'None', 'None', 'Brook Hospital', 'Fruit', 'Cold', 'Calm', 'Painting', 'None', 'None'),
('Liam', 'Harris', '1313 Magnolia St', 'Home', 'Hillview', 'NH', '60606', '1981-06-06', '555-6767', 'Work', 'M', 'Male', 'he/him', 'Hi', 'Lee', 0, 'Judaism', 'None', 'Hill Hospital', 'Chicken', 'Crowds', 'Peace', 'Golfing', 'None', 'None'),
('Isabella', 'Turner', '1414 Cypress Dr', 'Apartment', 'Clifftown', 'VT', '70707', '1994-04-04', '555-7878', 'Mobile', 'F', 'Female', 'she/her', 'Hello', 'Izzy', 1, 'None', 'None', 'Cliff Hospital', 'Ice Cream', 'Rain', 'Shine', 'Writing', 'None', 'None'),
('Mason', 'Wright', '1515 Juniper Ln', 'Home', 'Plainfield', 'RI', '80808', '1986-09-09', '555-8989', 'Home', 'M', 'Agender', 'they/them', 'Yo', 'Mace', 2, 'None', 'None', 'Plain Hospital', 'Toast', 'Dark', 'Thrive', 'Running', 'None', 'None'),

-- Clients 21–25
('Mia', 'Hill', '1616 Alder Blvd', 'Apartment', 'Clearwater', 'DE', '90909', '1993-03-03', '555-9090', 'Mobile', 'F', 'Female', 'she/her', 'Heya', 'Mimi', 0, 'None', 'None', 'Clear Hospital', 'Cake', 'Heat', 'Excel', 'Baking', 'None', 'None'),
('Logan', 'Green', '1717 Dogwood Rd', 'Home', 'Fairfield', 'CT', '11112', '1980-12-12', '555-1010', 'Work', 'M', 'Male', 'he/him', 'Sup', 'LG', 1, 'None', 'None', 'Fair Hospital', 'Tacos', 'Loud', 'Succeed', 'Coding', 'None', 'None'),
('Ava', 'Scott', '1818 Ash Ct', 'Apartment', 'Graytown', 'ND', '22223', '1989-08-08', '555-1112', 'Home', 'F', 'Non-binary', 'they/them', 'Hi', 'Avy', 0, 'None', 'None', 'Gray Hospital', 'Smoothies', 'Crowds', 'Balance', 'Cycling', 'None', 'None'),
('Lucas', 'Hall', '1919 Aspen Ave', 'Home', 'Whitetown', 'SD', '33334', '1992-02-02', '555-1213', 'Mobile', 'M', 'Male', 'he/him', 'Yo', 'Luke', 2, 'None', 'None', 'White Hospital', 'Waffles', 'Rain', 'Shine', 'Sculpting', 'None', 'None'),
('Ella', 'Allen', '2020 Hickory St', 'Apartment', 'Bluetown', 'WY', '44445', '1998-07-07', '555-1314', 'Work', 'F', 'Female', 'she/her', 'Hello', 'El', 1, 'None', 'None', 'Blue Hospital', 'Pasta', 'Cold', 'Achieve', 'Photography', 'None', 'None');


-- Create StaffClient associations linking the clients to staff
INSERT INTO StaffClient (staffID, clientID)
VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
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

-- StaffClient associations (random staff IDs)
INSERT INTO StaffClient (staffID, clientID)
VALUES
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(2, 11), (2, 12), (2, 13), (2, 14), (2, 15),
(2, 16), (3, 17), (1, 18), (2, 19), (3, 20),
(1, 21), (2, 22), (3, 23), (1, 24), (2, 25);

-- File inserts for profile pictures
INSERT INTO File (filename, uploadDate, ClientID)
VALUES
('client6_file.png', NOW(), 6), ('client7_file.png', NOW(), 7),
('client8_file.png', NOW(), 8), ('client9_file.png', NOW(), 9),
('client10_file.png', NOW(), 10), ('client11_file.png', NOW(), 11),
('client12_file.png', NOW(), 12), ('client13_file.png', NOW(), 13),
('client14_file.png', NOW(), 14), ('client15_file.png', NOW(), 15),
('client16_file.png', NOW(), 16), ('client17_file.png', NOW(), 17),
('client18_file.png', NOW(), 18), ('client19_file.png', NOW(), 19),
('client20_file.png', NOW(), 20), ('client21_file.png', NOW(), 21),
('client22_file.png', NOW(), 22), ('client23_file.png', NOW(), 23),
('client24_file.png', NOW(), 24), ('client25_file.png', NOW(), 25);

-- Update profilePicture field
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 6) WHERE CLIENTID = 6;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 7) WHERE CLIENTID = 7;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 8) WHERE CLIENTID = 8;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 9) WHERE CLIENTID = 9;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 10) WHERE CLIENTID = 10;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 11) WHERE CLIENTID = 11;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 12) WHERE CLIENTID = 12;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 13) WHERE CLIENTID = 13;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 14) WHERE CLIENTID = 14;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 15) WHERE CLIENTID = 15;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 16) WHERE CLIENTID = 16;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 17) WHERE CLIENTID = 17;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 18) WHERE CLIENTID = 18;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 19) WHERE CLIENTID = 19;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 20) WHERE CLIENTID = 20;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 21) WHERE CLIENTID = 21;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 22) WHERE CLIENTID = 22;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 23) WHERE CLIENTID = 23;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 24) WHERE CLIENTID = 24;
UPDATE Client SET profilePicture = (SELECT fileID FROM File WHERE ClientID = 25) WHERE CLIENTID = 25;

INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (1, '1707 E St, Suite 2', 'Eureka', 'CA', '95501', '707-443-7077', 'Summit Support Services');
INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (2, '1001 Searles St', 'Eureka', 'CA', '95501', '707-441-8625', 'Bay Center Day Services');
INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (3, '272 C St', 'Eureka', 'CA', '95501', '707-443-1428', 'Canvas + Clay Studio');
INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (4, '1707 E St, Suite 4', 'Eureka', 'CA', '95501', '707-443-7077', 'Comprehensive Career Services');
INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (5, '1707 E St, Suite 2', 'Eureka', 'CA', '95501', '707-443-7077', 'Respite Services');
INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (6, '1707 E St, Suite 2', 'Eureka', 'CA', '95501', '707-296-0646', 'Clinical Services');
INSERT INTO HCAR.Program (programID, address, city, state, zip, phoneNumber, name) VALUES (7, '1707 E St, Suite 2', 'Eureka', 'CA', '95501', '707-443-7077', 'Self-Determination Program');

INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (1, 1);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (2, 2);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (3, 3);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (4, 4);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (5, 5);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (6, 6);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (7, 7);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (8, 1);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (9, 2);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (10, 3);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (11, 4);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (12, 5);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (13, 6);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (14, 7);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (15, 1);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (16, 2);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (17, 3);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (18, 4);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (19, 5);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (20, 6);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (21, 7);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (22, 1);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (23, 2);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (24, 3);
INSERT INTO HCAR.ProgramClient (clientID, programID) VALUES (25, 4);