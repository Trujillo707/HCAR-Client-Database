import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";

afterAll(async () => {
    if (QueryParser.hasInstance()) {
        let foo = await new QueryParserBuilder().build();
        await foo.destructor();
    }
})

test("build() creates a QueryParser object With All Legal Env Vars", async ()=>{
    try {
        await expect(new QueryParserBuilder().build()).resolves.toBeInstanceOf(QueryParser);
        expect(QueryParser.hasInstance()).toBe(true);
    } catch (e) {
        throw e;
    }
}, 10000);