import {ClientBuilder} from "../objects/ClientBuilder.js";

describe("ClientBuilder Object Tests", ()=>{
    test("Creating Default ClientBuilder Instance", ()=>{
        expect(new ClientBuilder()).toBeInstanceOf(ClientBuilder);
    })
})