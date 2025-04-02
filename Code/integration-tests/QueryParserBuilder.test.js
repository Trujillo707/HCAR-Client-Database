import QueryParserBuilder from "../objects/QueryParserBuilder.js";
import QueryParser from "../objects/QueryParser.js";

test("build() creates a QueryParser object With All Legal Env Vars", async ()=>{
    try {
        await expect(new QueryParserBuilder().build()).resolves.toBeInstanceOf(QueryParser);
        expect(QueryParser.hasInstance()).toBe(true);
    } catch (e) {
        throw e;
    }
});