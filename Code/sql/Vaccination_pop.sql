-- Clients with 0 vaccines: 3, 7, 11, 15, 19, 23 (No inserts needed)

-- Clients with > 5 vaccines (e.g., Client 1, 5, 10, 20)
INSERT INTO Vaccination (clientID, name, dateTaken) VALUES
(1, 'MMR', '2022-01-15'),
(1, 'Varicella', '2022-01-15'),
(1, 'Hepatitis B - Dose 1', '2022-02-01'),
(1, 'Hepatitis B - Dose 2', '2022-03-01'),
(1, 'Hepatitis B - Dose 3', '2022-08-01'),
(1, 'Influenza', '2023-10-05'),
(1, 'COVID-19 - Dose 1', '2023-04-10'),
(1, 'COVID-19 - Dose 2', '2023-05-08'),

(5, 'DTaP - Dose 1', '2021-06-10'),
(5, 'DTaP - Dose 2', '2021-08-10'),
(5, 'DTaP - Dose 3', '2021-10-10'),
(5, 'DTaP - Dose 4', '2022-04-10'),
(5, 'Polio (IPV) - Dose 1', '2021-06-10'),
(5, 'Polio (IPV) - Dose 2', '2021-08-10'),
(5, 'Polio (IPV) - Dose 3', '2022-02-10'),
(5, 'Influenza', '2023-09-15'),

(10, 'Hepatitis A - Dose 1', '2020-03-20'),
(10, 'Hepatitis A - Dose 2', '2020-09-20'),
(10, 'MMR', '2021-05-01'),
(10, 'Varicella', '2021-05-01'),
(10, 'Influenza', '2022-11-01'),
(10, 'COVID-19 - Dose 1', '2023-01-15'),
(10, 'COVID-19 - Dose 2', '2023-02-12'),
(10, 'COVID-19 Booster', '2023-08-12'),

(20, 'HPV - Dose 1', '2022-07-01'),
(20, 'HPV - Dose 2', '2023-01-01'),
(20, 'Meningococcal ACWY', '2022-09-01'),
(20, 'Influenza', '2023-10-10'),
(20, 'Tdap Booster', '2023-05-05'),
(20, 'Pneumococcal (PCV13)', '2021-12-01');

-- Clients with 1-5 vaccines (Remaining clients: 2, 4, 6, 8, 9, 12, 13, 14, 16, 17, 18, 21, 22, 24, 25)
INSERT INTO Vaccination (clientID, name, dateTaken) VALUES
(2, 'Influenza', '2023-10-20'),
(2, 'COVID-19 - Dose 1', '2023-06-01'),
(2, 'COVID-19 - Dose 2', '2023-06-29'),

(4, 'Tdap', '2022-08-15'),

(6, 'Hepatitis B - Dose 1', '2023-01-10'),
(6, 'Hepatitis B - Dose 2', '2023-02-10'),
(6, 'Hepatitis B - Dose 3', '2023-07-10'),
(6, 'Influenza', '2023-09-25'),

(8, 'MMR', '2021-11-05'),
(8, 'Varicella', '2021-11-05'),

(9, 'Influenza', '2023-11-01'),

(12, 'COVID-19 - Dose 1', '2023-03-01'),
(12, 'COVID-19 - Dose 2', '2023-03-29'),
(12, 'COVID-19 Booster', '2023-09-29'),
(12, 'Influenza', '2023-10-15'),

(13, 'Tdap', '2023-02-20'),
(13, 'Influenza', '2023-10-01'),

(14, 'Hepatitis A - Dose 1', '2022-05-12'),
(14, 'Hepatitis A - Dose 2', '2022-11-12'),

(16, 'Influenza', '2023-10-08'),
(16, 'Pneumococcal (PPSV23)', '2023-04-18'),

(17, 'MMR', '2020-09-09'),
(17, 'Varicella', '2020-09-09'),
(17, 'Influenza', '2023-10-12'),

(18, 'Influenza', '2023-09-30'),
(18, 'COVID-19 - Dose 1', '2023-07-05'),
(18, 'COVID-19 - Dose 2', '2023-08-02'),
(18, 'Tdap', '2022-06-06'),

(21, 'Influenza', '2023-10-22'),

(22, 'Hepatitis B - Complete Series', '2021-03-15'),
(22, 'Influenza', '2023-10-05'),

(24, 'Tdap', '2023-01-25'),
(24, 'Influenza', '2023-10-18'),
(24, 'COVID-19 - Dose 1', '2023-05-10'),
(24, 'COVID-19 - Dose 2', '2023-06-07'),

(25, 'Influenza', '2023-11-05');
