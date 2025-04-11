import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";
// TODO: Create JSON or other list of expected outputs for tests

describe("QueryParser Class Tests", () => {
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
                        "name": "Bay Center Day Servies"
                    },
                    {
                        "clientID": 2,
                        "name": "Bay Center Day Servies"
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
                        "clientID": 21,
                        "name": "Self-Determination Program"
                    },
                    {
                        "clientID": 24,
                        "name": "Canvas + Clay Studio"
                    }
                ]
            ]]
        ])("Returns actual rows given valid acctID with records", async (acctID, rows) => {
            await expect(qp.getAllClients(acctID)).resolves.toStrictEqual(rows);
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

        // TODO: refactor into a more robust test for all search filters
        test("Gender Filter", async ()=>{
            await expect(qp.getAllFilteredClients(1, {gender: "Female"})).resolves.toStrictEqual([[
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
                        "name": "Bay Center Day Servies"
                    },
                    {
                        "clientID": 5,
                        "name": "Respite Services"
                    },
                    {
                        "clientID": 21,
                        "name": "Self-Determination Program"
                    }
                ]]
        )
        })
    })
})