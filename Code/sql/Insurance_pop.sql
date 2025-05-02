-- Insert unique sample data into the Insurance table
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('State Health Plan A', 111111111); -- ID 1 (example)
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Blue Cross Blue Shield PPO', 222222222); -- ID 2
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('United Healthcare Gold', 333333333); -- ID 3
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Aetna Choice POS II', 444444444); -- ID 4
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Cigna Connect', 555555555); -- ID 5
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Medicare Part A - Primary', 666666666); -- ID 6
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Medicare Part B - Primary', 777777777); -- ID 7
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Medicaid Plan Alpha', 888888888); -- ID 8
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Kaiser Permanente Silver', 999999999); -- ID 9
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Humana HMO', 101010100); -- ID 10
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('State Health Plan B', 121212121); -- ID 11
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Blue Cross Blue Shield HMO', 131313131); -- ID 12
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('United Healthcare Silver', 141414141); -- ID 13
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Aetna Bronze', 151515151); -- ID 14
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Medicaid Plan Beta', 161616161); -- ID 15
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Medicare Part A - Secondary', 171717171); -- ID 16
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Medicare Part B - Secondary', 181818181); -- ID 17
INSERT INTO HCAR.Insurance (name, policyNumber) VALUES ('Tricare Select', 191919191); -- ID 18

-- Update Client table with unique primary and secondary insurance FKs
-- Note: Assumes the INSERT statements above generated insuranceIDs 1 through 18 in order. Adjust IDs if necessary.

-- Client 1: Primary only
UPDATE HCAR.Client SET primaryInsurance = 1, secondaryInsurance = NULL WHERE clientID = 1;

-- Client 2: Primary and Secondary
UPDATE HCAR.Client SET primaryInsurance = 2, secondaryInsurance = 6 WHERE clientID = 2;

-- Client 3: Primary only
UPDATE HCAR.Client SET primaryInsurance = 3, secondaryInsurance = NULL WHERE clientID = 3;

-- Client 4: Primary and Secondary
UPDATE HCAR.Client SET primaryInsurance = 8, secondaryInsurance = 7 WHERE clientID = 4;

-- Client 5: No insurance listed (remains NULL)
UPDATE HCAR.Client SET primaryInsurance = NULL, secondaryInsurance = NULL WHERE clientID = 5;

-- Client 6: Primary only
UPDATE HCAR.Client SET primaryInsurance = 4, secondaryInsurance = NULL WHERE clientID = 6;

-- Client 7: Primary only (Medicaid)
UPDATE HCAR.Client SET primaryInsurance = 15, secondaryInsurance = NULL WHERE clientID = 7; -- Using ID 15 (Medicaid Beta)

-- Client 10: Primary and Secondary (Medicare)
UPDATE HCAR.Client SET primaryInsurance = 16, secondaryInsurance = 17 WHERE clientID = 10; -- Using IDs 16 & 17

-- Client 15: Primary only
UPDATE HCAR.Client SET primaryInsurance = 5, secondaryInsurance = NULL WHERE clientID = 15;

-- Client 20: Primary only (State Health)
UPDATE HCAR.Client SET primaryInsurance = 11, secondaryInsurance = NULL WHERE clientID = 20; -- Using ID 11 (State Health B)

-- Client 25: Primary and Secondary
UPDATE HCAR.Client SET primaryInsurance = 9, secondaryInsurance = 10 WHERE clientID = 25;