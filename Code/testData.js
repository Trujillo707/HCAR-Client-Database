import {ClientBuilder} from "./objects/ClientBuilder.js";
import {Program} from "./objects/Program.js";

/**
 * @type {Client[]}
 */
let testClientArray = [];
testClientArray.push(new ClientBuilder()
    .setFirstName("Alice")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Bob")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Cam")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Danny")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Edward")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Fred")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Harry")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Isaac")
    .setLastName("Auger")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("James")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setPrograms([new Program("Bay Center"), new Program("Clinical Services")])
    .build());

export {testClientArray}


console.log(Array.isArray(foo))