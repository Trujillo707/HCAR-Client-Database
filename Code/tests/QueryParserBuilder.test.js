import {jest} from '@jest/globals';

jest.unstable_mockModule('@google-cloud/cloud-sql-connector', ()=>({
    Connector: jest.fn().mockImplementation(()=>({
        getOptions: jest.fn(),
        close: jest.fn()
    }))
}));

jest.unstable_mockModule('mysql2/promise', ()=>({
    default: {
        createPool: jest.fn()
    }
}));

const {connectorMock}= await import('@google-cloud/cloud-sql-connector');
const mysql = (await import('mysql2/promise')).default;
const QueryParserBuilder = (await import('../objects/QueryParserBuilder.js')).default;
const QueryParser = (await import('../objects/QueryParser.js')).default;

const oldDBInstance = process.env.DB_INSTANCE;

describe('QueryParserBuilder Happy Path Tests', () =>{

    test("Creation of a QueryParserBuilder object", ()=>{
        expect(new QueryParserBuilder()).toBeInstanceOf(QueryParserBuilder);
    });

    test("build() creates a QueryParser object Assuming All Env Vars are set", async ()=>{
        if (!process.env.DB_INSTANCE){
            process.env.DB_INSTANCE = "foo:bar:baz";
        }

        try {
            await expect(new QueryParserBuilder().build()).resolves.toBeInstanceOf(QueryParser);
        } catch (e) {
            throw e;
        }
    });


});

describe("QueryParserBuilder Error Handling Tests", ()=>{
    let qpb;
    beforeEach(()=>{
        qpb = new QueryParserBuilder();
    })

    afterAll(()=>{
        process.env.DB_INSTANCE = oldDBInstance;
    })

    test.skip("Error is thrown when no process.env.DB_INSTANCE is set", async ()=>{
        process.env.DB_INSTANCE = undefined;
        await expect(qpb.build()).resolves.toThrowError("DB_INSTANCE env variable is undefined despite being required!")
    })
});