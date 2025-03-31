import {jest} from '@jest/globals';

jest.unstable_mockModule('@google-cloud/cloud-sql-connector', () => ({
    Connector: jest.fn().mockImplementation(() => ({
        getOptions: jest.fn(),
        close: jest.fn()
    }))
}));

jest.unstable_mockModule('mysql2/promise', () => ({
    default: {
        createPool: jest.fn().mockResolvedValue("mockPool")
    }
}));

const {connectorMock} = await import('@google-cloud/cloud-sql-connector');
const mysql = (await import('mysql2/promise')).default;
const QueryParserBuilder = (await import('../objects/QueryParserBuilder.js')).default;
const QueryParser = (await import('../objects/QueryParser.js')).default;

let qp;
const envBackup = process.env;

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

beforeEach(async () => {
    qp = await new QueryParserBuilder().build();
});

afterEach(() => {
    qp = null;
})

afterAll(() => {
    process.env = envBackup;
})

test("QueryParser Happy Path Object Creation", () => {
    expect(qp).toBeDefined()
})

test("getPool() returns a defined object", () => {
    expect(qp.getPool()).toBeDefined();
});

test("getGoogleConnector", () => {
    expect(qp.getGoogleConnector()).toBeDefined();
});