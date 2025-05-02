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
                    "profilePictureFilename": "client1_file.png",
                    "fName": "John",
                    "lName": "Doe",
                    "phoneNumber": "555-1234",
                    "email": null,
                    "dateOfBirth": new Date("1980-01-01"),
                    "pronouns": "he/him",
                    "gender": "Male"
                },
                {
                    "clientID": 2,
                    "profilePictureFilename": "client2_file.png",
                    "fName": "Jane",
                    "lName": "Smith",
                    "phoneNumber": "555-5678",
                    "email": null,
                    "dateOfBirth": new Date("1990-05-15"),
                    "pronouns": "she/her",
                    "gender": "Female"
                },
                {
                    "clientID": 4,
                    "profilePictureFilename": "client4_file.png",
                    "fName": "Robert",
                    "lName": "Brown",
                    "phoneNumber": "555-0000",
                    "email": null,
                    "dateOfBirth": new Date("1985-07-07"),
                    "pronouns": "he/him",
                    "gender": "Male"
                },
                {
                    "clientID": 5,
                    "profilePictureFilename": "client5_file.png",
                    "fName": "Emily",
                    "lName": "Davis",
                    "phoneNumber": "555-1111",
                    "email": null,
                    "dateOfBirth": new Date("1992-11-22"),
                    "pronouns": "she/her",
                    "gender": "Female"
                },
                {
                    "clientID": 18,
                    "profilePictureFilename": "client18_file.png",
                    "fName": "Liam",
                    "lName": "Harris",
                    "phoneNumber": "555-6767",
                    "email": null,
                    "dateOfBirth": new Date("1981-06-06"),
                    "pronouns": "he/him",
                    "gender": "Male"
                },
                {
                    "clientID": 20,
                    "profilePictureFilename": "client20_file.png",
                    "fName": "Mason",
                    "lName": "Wright",
                    "phoneNumber": "555-8989",
                    "email": null,
                    "dateOfBirth": new Date("1986-09-09"),
                    "pronouns": "they/them",
                    "gender": "Agender"
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
                    "gender": "Female"
                },
                {
                    "clientID": 24,
                    "profilePictureFilename": "client24_file.png",
                    "fName": "Lucas",
                    "lName": "Hall",
                    "phoneNumber": "555-1213",
                    "email": null,
                    "dateOfBirth": new Date("1992-02-02"),
                    "pronouns": "he/him",
                    "gender": "Male"
                }],
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
                        "clientID": 2,
                        "name": "Bay Center Day Services"
                    },
                    {
                        "clientID": 4,
                        "name": "Comprehensive Career Services"
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
                ]
            ]]
        ])("Returns actual rows given valid acctID with records", async (acctID, expected) => {
            const actual = await qp.getAllClients(acctID);
            console.log(actual)
            compareClientsPrograms(expected, actual);
        })

        /**
         * This one is a simple 2-val BVA for the max num of rows returned
         */
        test.each([
            2
        ])("Accounts with more than 10 clients only return 10 rows", async (acctID) => {
            let results = await qp.getAllClients(acctID);

            await expect(results[0].length).toBe(10);
        })
    });

    describe("getAllFilteredClients() method", () => {
        test("Reject calls with no acctID provided", async () => {
            await expect(qp.getAllFilteredClients()).resolves.toStrictEqual({"Error": "Invalid Authentication"})
        })

        test.each([
            [1, {gender: "Female"}, [[
                {
                    "clientID": 2,
                    "profilePictureFilename": "client2_file.png",
                    "fName": "Jane",
                    "lName": "Smith",
                    "phoneNumber": "555-5678",
                    "email": null,
                    "dateOfBirth": new Date("1990-05-15"),
                    "pronouns": "she/her",
                    "gender": "Female"
                },
                {
                    "clientID": 5,
                    "profilePictureFilename": "client5_file.png",
                    "fName": "Emily",
                    "lName": "Davis",
                    "phoneNumber": "555-1111",
                    "email": null,
                    "dateOfBirth": new Date("1992-11-22"),
                    "pronouns": "she/her",
                    "gender": "Female"
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
                    "gender": "Female"
                }],
                [
                    {
                        "clientID": 2,
                        "name": "Bay Center Day Services"
                    },
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
                    "profilePicture": "client1_file.png"
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

            await expect(results[0].length).toBe(10);
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
            [1, [
                {
                    "noteID": 13,
                    "subject": "Job Interview Skills Practice",
                    "dateCreated": new Date("2024-02-29 15:00:00"),
                    "creator": "Jake Mayer",
                    "programName": "Canvas + Clay Studio"
                },
                {
                    "noteID": 12,
                    "subject": "Quarterly IPP Progress Report Submission",
                    "dateCreated": new Date("2024-02-22 10:00:00"),
                    "creator": "Alba Heller",
                    "programName": "Summit Support Services"
                },
                {
                    "noteID": 11,
                    "subject": "Community Involvement Options Discussion",
                    "dateCreated": new Date("2024-02-15 14:00:00"),
                    "creator": "Lonzo Volkman",
                    "programName": "Bay Center Day Services"
                },
                {
                    "noteID": 10,
                    "subject": "ISP Goal Progress Check-in Call",
                    "dateCreated": new Date("2024-02-08 11:30:00"),
                    "creator": "Alba Heller",
                    "programName": "Summit Support Services"
                },
                {
                    "noteID": 9,
                    "subject": "ISP Goal Review: Budgeting",
                    "dateCreated": new Date("2024-02-01 09:00:00"),
                    "creator": "Alba Heller",
                    "programName": "Summit Support Services"
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
            [2, {
                primaryInsurance: {
                        "insuranceID": 2,
                        "name": "Blue Cross Blue Shield PPO",
                        "policyNumber": 222222222
                },
                secondaryInsurance: {
                        "insuranceID": 6,
                        "name": "Medicare Part A - Primary",
                        "policyNumber": 666666666
                },
                pcp: {
                        "contactID": 3,
                        "name": "CareFirst Clinic",
                        "phoneNumber": "555-2001",
                        "address": "789 Care Blvd, Healthton"
                    },
                primaryPhysician: {
                        "contactID": 2,
                        "name": "Dr. Bob Johnson",
                        "phoneNumber": "555-1002",
                        "address": "456 Wellness Ave, Medville"
                }
            }],
        ])("Valid clientID returns insurance and medical preferences", async (clientID, expected) => {
                await expect(qp.getInsuranceAndMedicalPreferences(clientID)).resolves.toStrictEqual(expected);
        });

    })
})