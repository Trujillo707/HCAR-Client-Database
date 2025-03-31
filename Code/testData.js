import {ClientBuilder} from "./objects/ClientBuilder.js";
import Programs from "./objects/Programs.js";
import Insurance from "./objects/Insurance.js";
import Medication from "./objects/Medication.js";
import Vaccination from "./objects/Vaccination.js";
import {SupportStaff} from "./objects/SupportStaff.js";
import CaseNote from "./objects/CaseNote.js";

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
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .setMaritalStatus("Divorced")
    .setPrimaryInsurance(new Insurance("Anthem Blue Cross", "123456789"))
    .setSecondaryInsurance(new Insurance("Other Insurance", "987654321"))
    .setMedicationList([new Medication("Oxycodone", true, "100 mg", "once every 6 hours",
                            "pain relief", "addiction, dryness of mouth", "Michael"),
                        new Medication("Hydrocodone", false, "5 mg", "once every 6 hours",
                            "pain relief", "dryness of mouth, addiction", "Bartholomew")])
    .setVaccinationList([new Vaccination("Tetanus", "12/25/2025"),
                         new Vaccination("Influenza", "3/30/2025")])
    .setSupportTeam([new SupportStaff("Nathaniel Post", "Caretaker", 1234567890,
                        new Date("2025-01-03"), new Date("2025-07-05")),
                     new SupportStaff("Howard Hill", "Worker 2", 123,
                        new Date("2005-05-06"), new Date("2012-03-04")),
                     new SupportStaff("Nigel Noodle", "Worker 1", 456,
                        new Date("2012-03-04"))])
    .setCaseNoteList([new CaseNote("This is a casenote", "2/4/2022", "Michael", "bay center", true, false),
                      new CaseNote("casenote wooo", "3/3/2024", "drew", "home visit", false, true)])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Bob")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
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
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Edward")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setEmail("alice@foobar.com")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Fred")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Harry")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("Isaac")
    .setLastName("Auger")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setEmail("alice@foobar.com")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());
testClientArray.push(new ClientBuilder()
    .setFirstName("James")
    .setLastName("Auger")
    .setPronouns("She/Her")
    .setDOB(new Date("2000-06-06"))
    .setSex("Female")
    .setPhoneNumber("707-777-7777")
    .setPrograms([new Programs("Bay Center"), new Programs("Clinical Services")])
    .build());

export {testClientArray}