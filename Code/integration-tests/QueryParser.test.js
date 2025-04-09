import {describe} from "@jest/globals";
import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";
// TODO: Create JSON or other list of expected outputs for tests

describe("QueryParser Class Tests", ()=>{
    let qp;

    beforeAll(async ()=>{
         qp = await new QueryParserBuilder().build();
    });

    afterAll(async () =>{
        await qp.destructor();
    })

    describe("getAllClients() method", ()=>{

        test("Rejects calls without acctID", async () => {
            await expect(qp.getAllClients()).resolves.toStrictEqual({"Error": "Invalid Authentication"});
        });

        test.each([
            [4], /* No clients */
            [42] /* does not exist */
        ])("Return no rows if Account does not exist or have clients", async (acctID) => {
            await expect(qp.getAllClients(acctID)).resolves.toStrictEqual([])
        });


        test.each([
            [1, [
                {
                    "clientID": 1,
                    "profilePicture": 1,
                    "fName": "John",
                    "lName": "Doe",
                    "phoneNumber": "555-1234",
                    "dateOfBirth": "1980-01-01",
                    "sex": "M"
                },
                {
                    "clientID": 2,
                    "profilePicture": 2,
                    "fName": "Jane",
                    "lName": "Smith",
                    "phoneNumber": "555-5678",
                    "dateOfBirth": "1990-05-15",
                    "sex": "F"
                },
                {
                    "clientID": 5,
                    "profilePicture": 5,
                    "fName": "Emily",
                    "lName": "Davis",
                    "phoneNumber": "555-1111",
                    "dateOfBirth": "1992-11-22",
                    "sex": "F"
                },
                {
                    "clientID": 18,
                    "profilePicture": 18,
                    "fName": "Liam",
                    "lName": "Harris",
                    "phoneNumber": "555-6767",
                    "dateOfBirth": "1981-06-06",
                    "sex": "M"
                },
                {
                    "clientID": 21,
                    "profilePicture": 21,
                    "fName": "Mia",
                    "lName": "Hill",
                    "phoneNumber": "555-9090",
                    "dateOfBirth": "1993-03-03",
                    "sex": "F"
                },
                {
                    "clientID": 24,
                    "profilePicture": 24,
                    "fName": "Lucas",
                    "lName": "Hall",
                    "phoneNumber": "555-1213",
                    "dateOfBirth": "1992-02-02",
                    "sex": "M"
                }
            ]]
        ])("Returns actual rows given valid acctID with records",  async (acctID, rows) => {
            await expect(qp.getAllClients(acctID)).resolves.toStrictEqual(rows);
        })

        /**
         * This one is a simple 2-val BVA for the max num of rows returned
         */
        test.each([
            [2]
        ])("Accounts with more than 10 clients only return 10 rows", async (acctID) => {
            let results = await qp.getAllClients(acctID);

            await expect(results.length).toBe(10);
        })
    });

    describe("getAllFilteredClients() method", ()=>{
        test("Reject calls with no acctID provided", async () => {
            await expect(qp.getAllFilteredClients()).resolves.toBe({"Error": "Invalid Authentication"})
        })
    })
})