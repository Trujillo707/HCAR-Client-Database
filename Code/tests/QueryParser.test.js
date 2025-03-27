import QueryParserBuilder from "../objects/QueryParserBuilder.js";

let qp;

beforeEach(async () => {
     qp = await new QueryParserBuilder().build();
});

afterEach(()=>{
    qp = null;
})

describe("QueryParser Happy Path Object Creation", () => {
    test("test", ()=>{
        expect(qp).toBeDefined()
    })
})