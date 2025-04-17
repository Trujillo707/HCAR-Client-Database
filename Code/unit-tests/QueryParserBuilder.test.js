import {jest} from '@jest/globals';

jest.unstable_mockModule('@google-cloud/cloud-sql-connector', () => ({
    Connector: jest.fn().mockImplementation(() => ({
        getOptions: jest.fn(),
        close: jest.fn()
    }))
}));

jest.unstable_mockModule('mysql2/promise', () => ({
    default: {
        createPool: jest.fn()
    }
}));

const {connectorMock} = await import('@google-cloud/cloud-sql-connector');
const mysql = (await import('mysql2/promise')).default;
const QueryParserBuilder = (await import('../objects/QueryParserBuilder.js')).default;
const QueryParser = (await import('../objects/QueryParser.js')).default;

const oldENV = process.env;

describe('QueryParserBuilder Happy Path Tests', () => {

    test("Creation of a QueryParserBuilder object", () => {
        expect(new QueryParserBuilder()).toBeInstanceOf(QueryParserBuilder);
    });

    test("build() creates a QueryParser object Assuming All Env Vars are set", async () => {
        if (process.env.DB_INSTANCE == null) {
            process.env.DB_INSTANCE = "foo:bar:baz";
        }
        if (process.env.DB_USER == null) {
            process.env.DB_USER = "foo";
        }
        if (process.env.DB_PASS == null) {
            process.env.DB_PASS = "bar";
        }
        if (process.env.DB_NAME == null) {
            process.env.DB_NAME = "baz"
        }

        try {
            await expect(new QueryParserBuilder().build()).resolves.toBeInstanceOf(QueryParser);
        } catch (e) {
            throw e;
        }
    });
    afterAll(()=>{
        process.env = oldENV;
    })
});

describe("QueryParserBuilder Error Handling Tests", () => {
    let qpb = null;
    beforeEach(async () => {
        qpb = new QueryParserBuilder();
        if (process.env.DB_INSTANCE == null) {
            process.env.DB_INSTANCE = "foo:bar:baz";
        }
        if (process.env.DB_USER == null) {
            process.env.DB_USER = "foo";
        }
        if (process.env.DB_PASS == null) {
            process.env.DB_PASS = "bar";
        }
        if (process.env.DB_NAME == null) {
            process.env.DB_NAME = "baz"
        }

        if (QueryParser.hasInstance()){
            let qp = await new QueryParserBuilder().build();
            await qp.destructor();
        }
    })

    afterEach(async ()=>{
        qpb = null;
    })

    afterAll(() => {
        process.env = oldENV;
    })

    test("Error is thrown when no process.env.DB_INSTANCE is set", async () => {

        delete process.env.DB_INSTANCE;
        await expect(qpb.build()).rejects.toThrowError(new Error("DB_INSTANCE env variable is undefined despite being required!"))
    });

    test("Error is thrown when no process.env.DB_USER is set", async () => {

        delete process.env.DB_USER;
        await expect(qpb.build()).rejects.toThrowError(new Error("DB_USER env variable is undefined despite being required!"))
    });

/*    test("Error is thrown when no process.env.DB_PASS is set", async () => {

        delete process.env.DB_PASS;
        await expect(qpb.build()).rejects.toThrowError(new Error("DB_PASS env variable is undefined despite being required!"))
    });*/

    test("Error is thrown when no process.env.DB_NAME is set", async () => {

        delete process.env.DB_NAME;
        await expect(qpb.build()).rejects.toThrowError(new Error("DB_NAME env variable is undefined despite being required!"))
    });
});