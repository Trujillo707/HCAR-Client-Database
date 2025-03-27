import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";

describe('QueryParserBuilder Happy Path Tests', () =>{
    test("Creation of a QueryParserBuilder object", ()=>{
        expect(new QueryParserBuilder()).toBeInstanceOf(QueryParserBuilder);
    });

    test("build() creates a QueryParser object Assuming All Env Vars are set", async ()=>{

        try {
            await expect(new QueryParserBuilder().build()).resolves.toBeInstanceOf(QueryParser);
        } catch (e) {
            throw e;
        }
    });
});

describe("QueryParserBuilder Error Handling Tests", ()=>{
    beforeEach(()=>{

    })
    test("Error is thrown when no process.env.DB_INSTANCE is set", async ()=>{

    })
});