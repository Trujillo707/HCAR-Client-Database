import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";

function compareJSON(key, expected, actual) {
    console.log(key, expected[key], actual[key]);
    if (expected[key] instanceof Date) {
        expect(actual[key].toISOString().slice(0, 10)).toBe(expected[key].toISOString().slice(0, 10));
    } else {
        expect(actual[key]).toStrictEqual(expected[key]);
    }
}

function compareClientsPrograms(expected, actual) {
    // Compare clients
    expect(actual[0].length).toBe(expected[0].length);
    for (let i = 0; i < expected[0].length; i++) {
        for (const key of Object.keys(expected[0][i])) {
            compareJSON(key, expected[0][i], actual[0][i]);
        }
    }
    // Compare programs
    expect(actual[1].length).toBe(expected[1].length);
    for (let i = 0; i < expected[1].length; i++) {
        for (const key of Object.keys(expected[1][i])) {
            compareJSON(key, expected[1][i], actual[1][i]);
        }
    }
}

describe("QueryParser Class Tests", () => {
    /** @type {QueryParser} */
    let qp;

    beforeAll(async () => {
        qp = await new QueryParserBuilder().build();
    });

    afterAll(async () => {
        await qp.destructor();
    })

    describe("getAllClients() method", () => {

        test("Rejects calls without acctID", async () => {
            await expect(qp.getAllClients()).resolves.toStrictEqual({"Error": "Invalid Authentication"});
        });

        test.each([
            4, /* No clients */
            42 /* does not exist */
        ])("Return no rows if Account does not exist or have clients", async (acctID) => {
            await expect(qp.getAllClients(acctID)).resolves.toStrictEqual([])
        });


        test.each([
            [1, [[
                {
                    "clientID": 1,
                    "profilePictureFilename": "https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg",
                    "fName": "John",
                    "mName": null,
                    "lName": "Doe",
                    "phoneNumber": "555-1234",
                    "email": null,
                    "dateOfBirth": new Date("1980-01-01"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": new Date("2026-05-28")
                },
                {
                    "clientID": 5,
                    "profilePictureFilename": "client5_file.png",
                    "fName": "Emily",
                    "mName": "Foo",
                    "lName": "Davis",
                    "phoneNumber": "555-1111",
                    "email": null,
                    "dateOfBirth": new Date("1992-11-22"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": new Date("2025-05-09")
                },
                {
                    "clientID": 18,
                    "profilePictureFilename": "client18_file.png",
                    "fName": "Liam",
                    "mName": null,
                    "lName": "Harris",
                    "phoneNumber": "555-6767",
                    "email": null,
                    "dateOfBirth": new Date("1981-06-06"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 20,
                    "profilePictureFilename": "client20_file.png",
                    "fName": "Mason",
                    "mName": null,
                    "lName": "Wright",
                    "phoneNumber": "555-8989",
                    "email": null,
                    "dateOfBirth": new Date("1986-09-09"),
                    "pronouns": "they/them",
                    "gender": "Agender",
                    "pos": null
                },
                {
                    "clientID": 21,
                    "profilePictureFilename": "client21_file.png",
                    "fName": "Mia",
                    "mName": null,
                    "lName": "Hill",
                    "phoneNumber": "555-9090",
                    "email": null,
                    "dateOfBirth": new Date("1993-03-03"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 24,
                    "profilePictureFilename": "client24_file.png",
                    "fName": "Lucas",
                    "mName": null,
                    "lName": "Hall",
                    "phoneNumber": "555-1213",
                    "email": null,
                    "dateOfBirth": new Date("1992-02-02"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                }
            ],[
                {
                    "clientID": 1,
                    "name": "Summit Support Services"
                },
                {
                    "clientID": 1,
                    "name": "Bay Center Day Services"
                },
                {
                    "clientID": 5,
                    "name": "Respite Services"
                },
                {
                    "clientID": 18,
                    "name": "Comprehensive Career Services"
                },
                {
                    "clientID": 20,
                    "name": "Clinical Services"
                },
                {
                    "clientID": 21,
                    "name": "Self-Determination Program"
                },
                {
                    "clientID": 24,
                    "name": "Canvas + Clay Studio"
                }
            ]]
        ]])("Returns actual rows given valid acctID with records", async (acctID, expected) => {
            const actual = await qp.getAllClients(acctID);
            console.log(actual)
            compareClientsPrograms(expected, actual);
        });

        /**
         * This one is a simple 2-val BVA for the max num of rows returned
         */
        test.each([
            2, /* has over 15 */
            3 /* has exactly 15 */
        ])("Accounts with more than 15 clients only return 15 rows", async (acctID) => {
            let results = await qp.getAllClients(acctID);

            await expect(results[0].length).toBe(15);
        });

        test.each([
            [5, [[
                {
                    "clientID": 1,
                    "profilePictureFilename": "https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg",
                    "fName": "John",
                    "mName": null,
                    "lName": "Doe",
                    "phoneNumber": "555-1234",
                    "email": null,
                    "dateOfBirth": new Date("1980-01-01"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": new Date("2026-05-28")
                },
                {
                    "clientID": 3,
                    "profilePictureFilename": "client3_file.png",
                    "fName": "Alice",
                    "mName": null,
                    "lName": "Johnson",
                    "phoneNumber": "555-9012",
                    "email": null,
                    "dateOfBirth": new Date("1975-03-20"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": new Date("2025-05-23")
                },
                {
                    "clientID": 5,
                    "profilePictureFilename": "client5_file.png",
                    "fName": "Emily",
                    "mName": "Foo",
                    "lName": "Davis",
                    "phoneNumber": "555-1111",
                    "email": null,
                    "dateOfBirth": new Date("1992-11-22"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": new Date("2025-05-09")
                },
                {
                    "clientID": 8,
                    "profilePictureFilename": "client8_file.png",
                    "fName": "Chris",
                    "mName": null,
                    "lName": "Martinez",
                    "phoneNumber": "555-4444",
                    "email": null,
                    "dateOfBirth": new Date("1995-12-12"),
                    "pronouns": "they/them",
                    "gender": "Non-binary",
                    "pos": null
                },
                {
                    "clientID": 11,
                    "profilePictureFilename": "client11_file.png",
                    "fName": "John",
                    "mName": "Michael",
                    "lName": "Doe",
                    "phoneNumber": "555-123-4567",
                    "email": "johndoe@example.com",
                    "dateOfBirth": new Date("1980-05-15"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 12,
                    "profilePictureFilename": "client12_file.png",
                    "fName": "Brian",
                    "mName": null,
                    "lName": "Young",
                    "phoneNumber": "555-8888",
                    "email": null,
                    "dateOfBirth": new Date("1982-03-03"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 13,
                    "profilePictureFilename": "client13_file.png",
                    "fName": "Hannah",
                    "mName": null,
                    "lName": "Lopez",
                    "phoneNumber": "555-9999",
                    "email": null,
                    "dateOfBirth": new Date("1996-07-07"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 14,
                    "profilePictureFilename": "client14_file.png",
                    "fName": "Ethan",
                    "mName": null,
                    "lName": "Clark",
                    "phoneNumber": "555-1212",
                    "email": null,
                    "dateOfBirth": new Date("1983-01-01"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 15,
                    "profilePictureFilename": "client15_file.png",
                    "fName": "Olivia",
                    "mName": null,
                    "lName": "Adams",
                    "phoneNumber": "555-3434",
                    "email": null,
                    "dateOfBirth": new Date("1999-10-10"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 16,
                    "profilePictureFilename": "client16_file.png",
                    "fName": "Noah",
                    "mName": null,
                    "lName": "Baker",
                    "phoneNumber": "555-4545",
                    "email": null,
                    "dateOfBirth": new Date("1984-05-05"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 17,
                    "profilePictureFilename": "client17_file.png",
                    "fName": "Sophia",
                    "mName": null,
                    "lName": "Perez",
                    "phoneNumber": "555-5656",
                    "email": null,
                    "dateOfBirth": new Date("1997-11-11"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 18,
                    "profilePictureFilename": "client18_file.png",
                    "fName": "Liam",
                    "mName": null,
                    "lName": "Harris",
                    "phoneNumber": "555-6767",
                    "email": null,
                    "dateOfBirth": new Date("1981-06-06"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 20,
                    "profilePictureFilename": "client20_file.png",
                    "fName": "Mason",
                    "mName": null,
                    "lName": "Wright",
                    "phoneNumber": "555-8989",
                    "email": null,
                    "dateOfBirth": new Date("1986-09-09"),
                    "pronouns": "they/them",
                    "gender": "Agender",
                    "pos": null
                },
                {
                    "clientID": 21,
                    "profilePictureFilename": "client21_file.png",
                    "fName": "Mia",
                    "mName": null,
                    "lName": "Hill",
                    "phoneNumber": "555-9090",
                    "email": null,
                    "dateOfBirth": new Date("1993-03-03"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 22,
                    "profilePictureFilename": "client22_file.png",
                    "fName": "Logan",
                    "mName": null,
                    "lName": "Green",
                    "phoneNumber": "555-1010",
                    "email": null,
                    "dateOfBirth": new Date("1980-12-12"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                }
            ],
                [
                    {
                        "clientID": 1,
                        "name": "Summit Support Services"
                    },
                    {
                        "clientID": 1,
                        "name": "Bay Center Day Services"
                    },
                    {
                        "clientID": 3,
                        "name": "Canvas + Clay Studio"
                    },
                    {
                        "clientID": 5,
                        "name": "Respite Services"
                    },
                    {
                        "clientID": 8,
                        "name": "Summit Support Services"
                    },
                    {
                        "clientID": 11,
                        "name": "Comprehensive Career Services"
                    },
                    {
                        "clientID": 12,
                        "name": "Respite Services"
                    },
                    {
                        "clientID": 13,
                        "name": "Clinical Services"
                    },
                    {
                        "clientID": 14,
                        "name": "Self-Determination Program"
                    },
                    {
                        "clientID": 15,
                        "name": "Summit Support Services"
                    },
                    {
                        "clientID": 16,
                        "name": "Bay Center Day Services"
                    },
                    {
                        "clientID": 17,
                        "name": "Canvas + Clay Studio"
                    },
                    {
                        "clientID": 18,
                        "name": "Comprehensive Career Services"
                    },
                    {
                        "clientID": 20,
                        "name": "Clinical Services"
                    },
                    {
                        "clientID": 21,
                        "name": "Self-Determination Program"
                    },
                    {
                        "clientID": 22,
                        "name": "Summit Support Services"
                    }
                ]]]
        ])("Admin Account returns all clients (with limit of 15 of course)", async (acctID, expected) => {
            const actual = await qp.getAllClients(acctID);
            compareClientsPrograms(expected, actual);
        });

    });

    describe("getAllFilteredClients() method", () => {
        test("Reject calls with no acctID provided", async () => {
            await expect(qp.getAllFilteredClients()).resolves.toStrictEqual({"Error": "Invalid Authentication"})
        })

        test.each([
            [1, {gender: "Female"}, [[
                {
                    "clientID": 5,
                    "profilePictureFilename": "client5_file.png",
                    "fName": "Emily",
                    "lName": "Davis",
                    "phoneNumber": "555-1111",
                    "email": null,
                    "dateOfBirth": new Date("1992-11-22"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": new Date("2025-05-09")
                },
                {
                    "clientID": 21,
                    "profilePictureFilename": "client21_file.png",
                    "fName": "Mia",
                    "lName": "Hill",
                    "phoneNumber": "555-9090",
                    "email": null,
                    "dateOfBirth": new Date("1993-03-03"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                }],
                [
                    {
                        "clientID": 5,
                        "name": "Respite Services"
                    },
                    {
                        "clientID": 21,
                        "name": "Self-Determination Program"
                    }
                ]]]
        ])("Gender Filter", async (acctID, filters, expected) => {
            const actual = await qp.getAllFilteredClients(acctID, filters);

            compareClientsPrograms(expected, actual);
        });

        test.each([
            [5, {firstName: "ll"}, [[
                {
                    "clientID": 25,
                    "profilePictureFilename": "client25_file.png",
                    "fName": "Ella",
                    "mName": null,
                    "lName": "Allen",
                    "phoneNumber": "555-1314",
                    "email": null,
                    "dateOfBirth": new Date("1998-07-07"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 39,
                    "profilePictureFilename": null,
                    "fName": "Isabella",
                    "mName": null,
                    "lName": "Scott",
                    "phoneNumber": "555-2728",
                    "email": "isabella.s@example.com",
                    "dateOfBirth": new Date("1995-09-14"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 59,
                    "profilePictureFilename": null,
                    "fName": "Isabella",
                    "mName": null,
                    "lName": "Scott",
                    "phoneNumber": "555-2728",
                    "email": "isabella.s@example.com",
                    "dateOfBirth": new Date("1995-09-14"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 68,
                    "profilePictureFilename": null,
                    "fName": "Isabella",
                    "mName": null,
                    "lName": "King",
                    "phoneNumber": "555-5678",
                    "email": "isabella.king@example.com",
                    "dateOfBirth": new Date("1996-04-18"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 77,
                    "profilePictureFilename": null,
                    "fName": "William",
                    "mName": null,
                    "lName": "Harris",
                    "phoneNumber": "5554567890",
                    "email": "william.harris@example.com",
                    "dateOfBirth": new Date("1987-03-19"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                },
                {
                    "clientID": 80,
                    "profilePictureFilename": null,
                    "fName": "Ella",
                    "mName": null,
                    "lName": "Young",
                    "phoneNumber": "5557890123",
                    "email": "ella.young@example.com",
                    "dateOfBirth": new Date("1993-09-17"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 92,
                    "profilePictureFilename": null,
                    "fName": "Ella",
                    "mName": null,
                    "lName": "Cooper",
                    "phoneNumber": "5550125678",
                    "email": "ella.cooper@example.com",
                    "dateOfBirth": new Date("1990-05-09"),
                    "pronouns": "she/her",
                    "gender": "Female",
                    "pos": null
                },
                {
                    "clientID": 122,
                    "profilePictureFilename": null,
                    "fName": "William",
                    "mName": null,
                    "lName": "Evans",
                    "phoneNumber": "5558889999",
                    "email": "william.evans@example.com",
                    "dateOfBirth": new Date("1987-09-09"),
                    "pronouns": "he/him",
                    "gender": "Male",
                    "pos": null
                }
            ],[
                {
                    "clientID": 25,
                    "name": "Comprehensive Career Services"
                }
            ]

            ]]
        ])("Admin account returns all clients with filters", async  (acctID, filters, expected) => {
            const actual = await qp.getAllFilteredClients(acctID, filters);

            compareClientsPrograms(expected, actual);
        })
    });

    describe("getClientDemographics() method", () => {
        test("Reject calls with no clientID provided", async () => {
            await expect(qp.getClientDemographics()).resolves.toStrictEqual({"Error": "Invalid ClientID"})
        });
        test("Non existent clientID returns error string", async () => {
            await expect(qp.getClientDemographics(99999)).resolves.toStrictEqual({"Error": "Client not found"});
        });

        test.each([
            [1,
                {
                    "clientID": 1,
                    "fName": "John",
                    "lName": "Doe",
                    "email": null,
                    "address": "123 Main St",
                    "addressType": "Home",
                    "city": "Anytown",
                    "state": "NY",
                    "zip": "12345",
                    "dateOfBirth": new Date("1980-01-01"),
                    "phoneNumber": "555-1234",
                    "phoneType": "Mobile",
                    "sex": "M",
                    "gender": "Male",
                    "pronouns": "he/him",
                    "pos": new Date("2026-05-28"),
                    "greeting": "Hello",
                    "nickname": "Johnny",
                    "maritalStatus": 0,
                    "religPref": "None",
                    "payee": "None",
                    "preferredHospital": "General Hospital",
                    "likes": "Pizza",
                    "dislikes": "Traffic",
                    "goals": "Succeed",
                    "hobbies": "Reading",
                    "achievements": "None",
                    "conservator": "None",
                    "profilePicture": "https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg"
                }
            ]
        ])("Valid clientID returns client demographics", async (clientID, expected) => {
            const actual = await qp.getClientDemographics(clientID);

            for (const key of Object.keys(expected)) {
                compareJSON(key, expected, actual);
            }
        });

        test.each([
            2
        ])("Accounts with more than 10 clients only return 10 rows", async (acctID) => {
            let results = await qp.getAllFilteredClients(acctID);

            await expect(results[0].length).toBe(15);
        })
    });

    describe("getMedicationList() method", () => {
        test("Reject calls with no clientID provided", async () => {
            await expect(qp.getMedicationList()).resolves.toStrictEqual({"Error": "Invalid ClientID"});
        })

        test("Non-existent clientID returns empty array", async () => {
            await expect(qp.getMedicationList(99999)).resolves.toStrictEqual([]);
        });

        test.each([
            [1, [
                {
                    "medicationID": 1,
                    "name": "Advil",
                    "prn": 1,
                    "dosage": "50mg",
                    "frequency": "One dosage per 4 hours",
                    "purpose": "Pain relief",
                    "sideEffects": "Heartburn",
                    "prescriber": "Dr. Anthony Bennet, GP"
                },
                {
                    "medicationID": 3,
                    "name": "Dextromethorphan",
                    "prn": 1,
                    "dosage": "10mg",
                    "frequency": "One dosage per 5 hours",
                    "purpose": "Cough Suppressant ",
                    "sideEffects": "nausea, vomiting, drowsiness, dizziness, difficulty breathing, fast heartbeat, seizures",
                    "prescriber": "Dr. Luis Packard, Pulmonologist"
                },
                {
                    "medicationID": 2,
                    "name": "Vitamin D",
                    "prn": 0,
                    "dosage": "10mg",
                    "frequency": "One a day",
                    "purpose": "Vitamin D deficiency ",
                    "sideEffects": null,
                    "prescriber": "Dr. Anthony Bennet, GP"
                }
            ]]
        ])("Valid clientID returns medication list", async (clientID, expected) => {
            const actual = await qp.getMedicationList(clientID);
            for (let i = 0; i < expected.length; i++) {
                for (const key of Object.keys(expected[i])) {
                    compareJSON(key, expected[i], actual[i]);
                }
            }
        })
    });

    describe("getVaccinationList() method", () => {
        test("Reject calls with no clientID provided", async () => {
            await expect(qp.getVaccinationList()).resolves.toStrictEqual({"Error": "Invalid ClientID"});
        });

        test("Non-existent clientID returns empty array", async () => {
            await expect(qp.getVaccinationList(99999)).resolves.toStrictEqual([]);
        });

        test.each([
            [1, [
                {
                    "clientID": 1,
                    "name": "Influenza",
                    "dateTaken": new Date("2023-10-05")
                },
                {
                    "clientID": 1,
                    "name": "COVID-19 - Dose 2",
                    "dateTaken": new Date("2023-05-08")
                },
                {
                    "clientID": 1,
                    "name": "COVID-19 - Dose 1",
                    "dateTaken": new Date("2023-04-10")
                },
                {
                    "clientID": 1,
                    "name": "Hepatitis B - Dose 3",
                    "dateTaken": new Date("2022-08-01")
                },
                {
                    "clientID": 1,
                    "name": "Hepatitis B - Dose 2",
                    "dateTaken": new Date("2022-03-01")
                },
                {
                    "clientID": 1,
                    "name": "Hepatitis B - Dose 1",
                    "dateTaken": new Date("2022-02-01")
                },
                {
                    "clientID": 1,
                    "name": "MMR",
                    "dateTaken": new Date("2022-01-15")
                },
                {
                    "clientID": 1,
                    "name": "Varicella",
                    "dateTaken": new Date("2022-01-15")
                }
            ]],
            [25, [
                {
                    "clientID": 25,
                    "name": "Influenza",
                    "dateTaken": new Date("2023-11-05")
                }
            ]]
        ])("Valid clientID returns vaccination list", async (clientID, expected) => {
            const actual = await qp.getVaccinationList(clientID);
            for (let i = 0; i < expected.length; i++) {
                for (const key of Object.keys(expected[i])) {
                    compareJSON(key, expected[i], actual[i]);
                }
            }
        })
    });

    describe("getCaseNoteList() method", () => {
        test("Reject calls with no clientID provided", async () => {
            await expect(qp.getCaseNoteList()).resolves.toStrictEqual({"Error": "Invalid ClientID"});
        });

        test("Non-existent clientID returns empty array", async () => {
            await expect(qp.getCaseNoteList(99999)).resolves.toStrictEqual([]);
        });

        test.each([
            [8, [
                {
                    "noteID": 7,
                    "subject": "Public Transport Training",
                    "dateCreated": new Date("2024-01-22 16:15:00"),
                    "creator": "Jake Mayer",
                    "programName": "Canvas + Clay Studio"
                },
                {
                    "noteID": 5,
                    "subject": "Social Skills Check-in Call",
                    "dateCreated": new Date("2024-01-15 14:00:00"),
                    "creator": "Lonzo Volkman",
                    "programName": "Bay Center Day Services"
                }
            ]]
        ])("Valid clientID returns Case Note list", async (clientID, expected) => {
            const actual = await qp.getCaseNoteList(clientID);
            for (let i = 0; i < expected.length; i++) {
                for (const key of Object.keys(expected[i])) {
                    compareJSON(key, expected[i], actual[i]);
                }
            }
        })
    });

    describe("getCaseNote() method", () => {
        test("Reject calls with no noteID provided", async () => {
            await expect(qp.getCaseNote()).resolves.toStrictEqual({"Error": "Invalid NoteID"});
        });

        test("Non-existent noteID returns error string", async () => {
            await expect(qp.getCaseNote(99999)).resolves.toStrictEqual({"Error": "Note not found"});
        });

        test.each([
            [4, {
                "noteID": 4,
                "subject": "Budget Planning Discussion",
                "dateCreated": new Date("2024-01-10 09:30:00"),
                "staffID": 1,
                "programName": "Summit Support Services",
                "dateModified": null,
                "contactType": "In-Person",
                "goal": "ISP Goal",
                "narrative": "Discussed weekly budget planning. Client was engaged.",
                "goalProgress": "Client made progress towards understanding budgeting.",
                "nextSteps": "Review budget next week."
            }],
            [5, {
                "noteID": 5,
                "subject": "Social Skills Check-in Call",
                "dateCreated": new Date("2024-01-15 14:00:00"),
                "staffID": 2,
                "programName": "Bay Center Day Services",
                "dateModified": new Date("2024-01-15 15:30:00"),
                "contactType": "Over the Phone",
                "goal": "Personal Goal",
                "narrative": "Phone call check-in. Discussed potential social activities.",
                "goalProgress": "Client expressed desire to improve social skills.",
                "nextSteps": "Provide list of local community groups."
            }]
        ])("Valid noteID returns Case Note", async (noteID, expected) => {
            const actual = await qp.getCaseNote(noteID);
            for (const key of Object.keys(expected)) {
                compareJSON(key, expected, actual);
            }
        });
    });

    describe("getSupportStaffList() method", () => {
        test("Reject calls with no clientID provided", async () => {
            await expect(qp.getSupportStaffList()).resolves.toStrictEqual({"Error": "Invalid ClientID"});
        });

        test("Non-existent clientID returns empty array", async () => {
            await expect(qp.getSupportStaffList(99999)).resolves.toStrictEqual([]);
        });

        test.each([
            [1, [
                {
                    "staffID": 3,
                    "staffName": "Jake Mayer",
                    "title": "Counselor 1",
                    "dateAssigned": new Date("2024-01-10"),
                    "dateRemoved": null
                },
                {
                    "staffID": 2,
                    "staffName": "Lonzo Volkman",
                    "title": "Support Staff 2",
                    "dateAssigned": new Date("2023-09-15"),
                    "dateRemoved": null
                },
                {
                    "staffID": 1,
                    "staffName": "Alba Heller",
                    "title": "Case Manager 1",
                    "dateAssigned": new Date("2023-01-15"),
                    "dateRemoved": null
                }
            ]],
            [20, [
                {
                    "staffID": 2,
                    "staffName": "Lonzo Volkman",
                    "title": "Support Staff 2",
                    "dateAssigned": new Date("2024-03-18"),
                    "dateRemoved": null
                },
                {
                    "staffID": 1,
                    "staffName": "Alba Heller",
                    "title": "Case Manager 1",
                    "dateAssigned": new Date("2023-11-20"),
                    "dateRemoved": new Date("2024-03-01")
                },
                {
                    "staffID": 3,
                    "staffName": "Jake Mayer",
                    "title": "Counselor 1",
                    "dateAssigned": new Date("2023-08-15"),
                    "dateRemoved": null
                }
            ]]
        ])("Valid clientID returns support staff list", async (clientID, expected) => {
            const actual = await qp.getSupportStaffList(clientID);
            for (let i = 0; i < expected.length; i++) {
                for (const key of Object.keys(expected[i])) {
                    compareJSON(key, expected[i], actual[i]);
                }
            }
        })
    });

    describe("getInsuranceAndMedicalPreferences() method", () => {
        test("Reject calls with no clientID provided", async () => {
            await expect(qp.getInsuranceAndMedicalPreferences()).resolves.toStrictEqual({"Error": "Invalid ClientID"});
        });

        test.each([
            99999
        ])("Non-existent clientID returns object with undefined key value", async (clientID) => {
            await expect(qp.getInsuranceAndMedicalPreferences(clientID)).resolves.toStrictEqual(
                {
                    primaryInsurance: undefined,
                    secondaryInsurance: undefined,
                    pcp: undefined,
                    primaryPhysician: undefined
                }
            );
        });

        test.each([
            [5, {
                primaryInsurance: {
                    "insuranceID": 19,
                    "name": "Partnership",
                    "policyNumber": 123456789
                },
                secondaryInsurance: {
                    "insuranceID": 20,
                    "name": "Blue Cross Blue Shield HMO",
                    "policyNumber": 987654321
                },
                pcp:{
                        "contactID": 9,
                        "name": "Metro Medical Group",
                        "phoneNumber": "555-2003",
                        "address": "606 Doctor Way, Medville"
                    },
                primaryPhysician: {
                        "contactID": 7,
                        "name": "Dr. Eve Davis",
                        "phoneNumber": "555-1005",
                        "address": "404 Cure Ct, Medville"
                    }
            }],
        ])("Valid clientID returns insurance and medical preferences", async (clientID, expected) => {
                //await expect(qp.getInsuranceAndMedicalPreferences(clientID)).resolves.toStrictEqual(expected);
            const actual = await qp.getInsuranceAndMedicalPreferences(clientID);
            console.log(actual);
            expect(actual).toStrictEqual(expected);
        });

    })
})