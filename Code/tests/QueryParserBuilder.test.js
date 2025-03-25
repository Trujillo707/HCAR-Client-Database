import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";

describe('QueryParserBuilder Tests', () =>{
    test("Creation of a QueryParserBuilder object", ()=>{
        expect(new QueryParserBuilder()).toBeInstanceOf(QueryParserBuilder);
    });

    test("build() creates a QueryParser object", async ()=>{
        try {
            await expect(new QueryParserBuilder().build()).resolves.toBeInstanceOf(QueryParser);
        } catch (e) {
            throw e;
        }
    });
});