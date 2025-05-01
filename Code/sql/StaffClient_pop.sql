INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 1, 'Case Manager 1', '2023-01-15', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 2, 'Case Manager 1', '2023-02-01', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 5, 'Case Manager 1', '2023-03-10', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 18, 'Case Manager 1', '2023-04-20', '2024-01-31');
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 21, 'Case Manager 1', '2023-05-05', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 24, 'Case Manager 1', '2023-06-15', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 3, 'Support Staff 2', '2023-01-20', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 6, 'Support Staff 2', '2023-02-10', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 7, 'Support Staff 2', '2023-03-01', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 8, 'Support Staff 2', '2023-03-15', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 9, 'Support Staff 2', '2023-04-05', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 10, 'Support Staff 2', '2023-04-25', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 11, 'Support Staff 2', '2023-05-10', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 12, 'Support Staff 2', '2023-05-20', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 13, 'Support Staff 2', '2023-06-01', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 14, 'Support Staff 2', '2023-06-12', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 15, 'Support Staff 2', '2023-07-01', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 16, 'Support Staff 2', '2023-07-18', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 19, 'Support Staff 2', '2023-08-05', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 22, 'Support Staff 2', '2023-08-22', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 25, 'Support Staff 2', '2023-09-10', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 4, 'Counselor 1', '2023-02-20', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 17, 'Counselor 1', '2023-07-25', '2024-02-15');
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 20, 'Counselor 1', '2023-08-15', null);
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 23, 'Counselor 1', '2023-09-01', null);

-- Add more StaffClient associations so some clients have multiple staff
-- Assuming staffID 1 is Case Manager, staffID 2 is Support Staff, staffID 3 is Counselor

-- Client 1 (already has Staff 1) gets Staff 2
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (2, 1, 'Support Staff 2', '2023-09-15', NULL);

-- Client 4 (already has Staff 3) gets Staff 1
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 4, 'Case Manager 1', '2023-10-01', NULL);

-- Client 8 (already has Staff 2) gets Staff 3
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 8, 'Counselor 1', '2023-11-05', NULL);

-- Client 20 (already has Staff 3) gets Staff 1
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (1, 20, 'Case Manager 1', '2023-11-20', '2024-03-01'); -- Example past assignment

-- Client 25 (already has Staff 2) gets Staff 3
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 25, 'Counselor 1', '2023-12-10', NULL);

-- Add Staff 3 association for Client 1 (who already has Staff 1 and Staff 2)
INSERT INTO HCAR.StaffClient (staffID, clientID, title, dateAssigned, dateRemoved) VALUES (3, 1, 'Counselor 1', '2024-01-10', NULL);