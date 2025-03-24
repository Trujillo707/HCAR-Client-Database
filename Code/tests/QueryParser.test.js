import QueryParser from "../objects/QueryParser.js";

describe('QueryParser Object Tests', () =>{
    test("Default Object Creation", ()=>{
        expect(new QueryParser()).toBeInstanceOf(QueryParser);
    })
});