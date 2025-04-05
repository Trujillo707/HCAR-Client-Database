import {describe} from "@jest/globals";
import QueryParserBuilder from "../objects/QueryParserBuilder.js";
// TODO: Create JSON or other list of expected outputs for tests

describe("QueryParser Class Tests", ()=>{
    let qp;

    beforeAll(async ()=>{
        await qp =  new QueryParserBuilder().build();
    });

    describe("getAllClients() method", ()=>{

        test("Rejects calls without acctID", ()=>{
            expect(qp.getAllClients()).toBe({"Error": "Invalid Authentication"});
        });

        test.each([
            [999999999999],
            [42]
        ])("Return no rows if Account does not exist or have clients", (acctID)=>{
            expect(qp.getAllCients(acctID)).toBe([])
        });

        test.each([
            [1, {}],
            [2, {}]
        ])("Returns actual rows given valid acctID with records", (acctID, rows)=>{
            expect(qp.getAllClients(acctID)).toStrictEqual(rows);
        })

        /**
         * This one is a simple 2-val BVA for the max num of rows returned
         */
        test.each([
            [3],
            [4]
        ])("Accounts with more than 10 clients only return 10 rows", (acctID)=>{
            let results = qp.getAllClients(acctID);

            expect(results.length).toBe(10);
        })
    });

    describe("getAllFilteredClients() method", ()=>{
        test("Reject calls with no acctID provided", ()=>{
            expect(qp.getAllFilteredClients()).toBe({"Error": "Invalid Authentication"})
        })
    })
})