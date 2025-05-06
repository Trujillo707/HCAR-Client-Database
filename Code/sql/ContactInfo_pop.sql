-- Insert sample data into the ContactInfo table for providers/physicians
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Alice Smith', '555-1001', '123 Health St, Medville'); -- ID 1 (example)
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Bob Johnson', '555-1002', '456 Wellness Ave, Medville'); -- ID 2
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('CareFirst Clinic', '555-2001', '789 Care Blvd, Healthton'); -- ID 3
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Carol White', '555-1003', '101 Medical Dr, Healthton'); -- ID 4
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. David Brown', '555-1004', '202 Hospital Rd, Medville'); -- ID 5
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Community Health Partners', '555-2002', '303 Provider Ln, Healthton'); -- ID 6
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Eve Davis', '555-1005', '404 Cure Ct, Medville'); -- ID 7
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Frank Miller', '555-1006', '505 Remedy Pl, Healthton'); -- ID 8
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Metro Medical Group', '555-2003', '606 Doctor Way, Medville'); -- ID 9
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Grace Wilson', '555-1007', '707 Healing Path, Healthton'); -- ID 10
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Henry Moore', '555-1008', '808 Checkup Cir, Medville'); -- ID 11
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Wellness Associates', '555-2004', '909 Therapy Trl, Healthton'); -- ID 12
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Irene Taylor', '555-1009', '110 Health St, Medville'); -- ID 13
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Jack Anderson', '555-1010', '120 Wellness Ave, Medville'); -- ID 14
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Primary Care Center', '555-2005', '130 Care Blvd, Healthton'); -- ID 15
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Karen Thomas', '555-1011', '140 Medical Dr, Healthton'); -- ID 16
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Larry Jackson', '555-1012', '150 Hospital Rd, Medville'); -- ID 17
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Family Health Services', '555-2006', '160 Provider Ln, Healthton'); -- ID 18
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Mary White', '555-1013', '170 Cure Ct, Medville'); -- ID 19
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Nancy Harris', '555-1014', '180 Remedy Pl, Healthton'); -- ID 20
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('General Practice Group', '555-2007', '190 Doctor Way, Medville'); -- ID 21
INSERT INTO HCAR.ContactInfo (name, phoneNumber, address) VALUES ('Dr. Olivia Martin', '555-1015', '210 Healing Path, Healthton'); -- ID 22

-- Update Client table with primaryCareProvider and primaryPhysician FKs for clients 1-25
-- Note: Assumes ContactInfo INSERTs generated IDs 1 through 22. Assumes clients 1-25 exist.

-- Clients 1-22: Both Provider and Physician set
UPDATE HCAR.Client SET primaryCareProvider = 3, primaryPhysician = 1 WHERE clientID = 1;
UPDATE HCAR.Client SET primaryCareProvider = 3, primaryPhysician = 2 WHERE clientID = 2;
UPDATE HCAR.Client SET primaryCareProvider = 6, primaryPhysician = 4 WHERE clientID = 3;
UPDATE HCAR.Client SET primaryCareProvider = 6, primaryPhysician = 5 WHERE clientID = 4;
UPDATE HCAR.Client SET primaryCareProvider = 9, primaryPhysician = 7 WHERE clientID = 5;
UPDATE HCAR.Client SET primaryCareProvider = 9, primaryPhysician = 8 WHERE clientID = 6;
UPDATE HCAR.Client SET primaryCareProvider = 12, primaryPhysician = 10 WHERE clientID = 7;
UPDATE HCAR.Client SET primaryCareProvider = 12, primaryPhysician = 11 WHERE clientID = 8; -- Client 8
UPDATE HCAR.Client SET primaryCareProvider = 15, primaryPhysician = 13 WHERE clientID = 9; -- Client 9
UPDATE HCAR.Client SET primaryCareProvider = 15, primaryPhysician = 14 WHERE clientID = 10;
UPDATE HCAR.Client SET primaryCareProvider = 18, primaryPhysician = 16 WHERE clientID = 11; -- Client 11
UPDATE HCAR.Client SET primaryCareProvider = 18, primaryPhysician = 17 WHERE clientID = 12; -- Client 12
UPDATE HCAR.Client SET primaryCareProvider = 21, primaryPhysician = 19 WHERE clientID = 13; -- Client 13
UPDATE HCAR.Client SET primaryCareProvider = 21, primaryPhysician = 20 WHERE clientID = 14; -- Client 14
UPDATE HCAR.Client SET primaryCareProvider = 3, primaryPhysician = 22 WHERE clientID = 15;
UPDATE HCAR.Client SET primaryCareProvider = 6, primaryPhysician = 1 WHERE clientID = 16; -- Client 16
UPDATE HCAR.Client SET primaryCareProvider = 9, primaryPhysician = 2 WHERE clientID = 17; -- Client 17
UPDATE HCAR.Client SET primaryCareProvider = 12, primaryPhysician = 4 WHERE clientID = 18; -- Client 18
UPDATE HCAR.Client SET primaryCareProvider = 15, primaryPhysician = 5 WHERE clientID = 19; -- Client 19
UPDATE HCAR.Client SET primaryCareProvider = 18, primaryPhysician = 7 WHERE clientID = 20;
UPDATE HCAR.Client SET primaryCareProvider = 21, primaryPhysician = 8 WHERE clientID = 21; -- Client 21
UPDATE HCAR.Client SET primaryCareProvider = 3, primaryPhysician = 10 WHERE clientID = 22; -- Client 22

-- Client 23: Only Provider set
UPDATE HCAR.Client SET primaryCareProvider = 6, primaryPhysician = NULL WHERE clientID = 23; -- Client 23

-- Client 24: Only Physician set
UPDATE HCAR.Client SET primaryCareProvider = NULL, primaryPhysician = 11 WHERE clientID = 24; -- Client 24

-- Client 25: Neither set
UPDATE HCAR.Client SET primaryCareProvider = NULL, primaryPhysician = NULL WHERE clientID = 25;