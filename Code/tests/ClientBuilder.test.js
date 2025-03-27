import {ClientBuilder} from "../objects/ClientBuilder.js";
import {Client} from "../objects/Client.js";
import Programs from "../objects/Programs.js";
import Insurance from "../objects/Insurance.js";
import Address from "../objects/Address.js";
import ContactInfo from "../objects/ContactInfo.js";
import Medication from "../objects/Medication.js";
import {SupportStaff} from "../objects/SupportStaff.js";
import CaseNote from "../objects/CaseNote.js";

describe("ClientBuilder Object Creation", () => {
    test("Creating Default ClientBuilder Instance", () => {
        expect(new ClientBuilder()).toBeInstanceOf(ClientBuilder);
    });

    test("Building default Client with ClientBuilder", () => {
        expect(new ClientBuilder().build()).toBeInstanceOf(Client)
    })
})

describe("ClientBuilder Setters", () => {
    let theClient;
    beforeAll(() => {
        theClient = new ClientBuilder()
            .setMiddleName("Abigail")
            .setLastName("Auger")
            .setPronouns("She/Her")
            .setPhoneNumber("707-777-7777")
            .setAddress(new Address("123 A St.", "Arcata", "California", "95521"))
            .setEmail("alice@foobar.com")
            .setDOB(new Date("2000-06-06"))
            .setSex("Female")
            .setMaritalStatus("Single")
            .setPreferredHospital("St. Joseph")
            .setPrimaryInsurance(new Insurance("Medical", "12345"))
            .setSecondaryInsurance(new Insurance("Blue Cross", "67890"))
            .setPcp(new ContactInfo("Open Door", "777-777-7777", "456 B St Arcata, CA"))
            .setPrimaryPhysician(new ContactInfo("Dr. Ron Bon", "777-777-8888", "456 B St Arcata, CA"))
            .setMedicationList([
                new Medication("Codine", false, "10mL", "Twice a day", "Cough",
                    "None", "Dr. Phil"),
                new Medication("Vitamin D", true, "5mg", "Once a day",
                    "Deficiency", "Irritability", "Dr. Foobar")
            ])
            .setLikes("Likes to go on walks. Likes cats. Likes sand")
            .setDislikes("Hates cows. Hates cereal. Dislikes milk")
            .setGoals("Go to the moon. Go to Ohio")
            .setHobbies("Calculus. Knitting. Video Games")
            .setAchievements("Won the 2012 Olympic Games in Boxing")
            .setMiscNotes("Known to steal cheese")
            .setSupportTeam([
                new SupportStaff("Howard Hill", "Worker 2", 123, new Date("2005-05-06"),
                    new Date("2012-03-04")),
                new SupportStaff("Nigel Noodle", "Worker 1", 456, new Date("2012-03-04"))
            ])
            .setCaseNoteList([
                new CaseNote("Spent all their weekly budget", new Date("2025-01-25"), "Bob Saget",
                    false, true),
                new CaseNote("Got into verbal dispute at home", new Date("2023-06-14"),
                    "Mary Hawthorn", true, false)
            ])
            .setPictureURL("https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg")
            .setPrograms([
                new Programs("Bay Center"),
                new Programs("Clinical Services")
            ])
            .build();
    });

    test("firstName", () => {
        expect(theClient.getFirstName()).toBe("Alice")
    });

    test("middleName", () => {
        expect(theClient.getMiddleName()).toBe("Abigail")
    });

    test("lastName", () => {
        expect(theClient.getLastName()).toBe("Auger")
    });

    test("pronouns", () => {
        expect(theClient.getPronouns()).toBe("She/Her")
    });

    test("phoneNumber", () => {
        expect(theClient.getPhoneNumber()).toBe("707-777-7777")
    });

    test("Address", () => {
        expect(theClient.getAddress()).toStrictEqual(new Address("123 A St.", "Arcata", "California", "95521"))
    });

    test("email", () => {
        expect(theClient.getEmail()).toBe("alice@foobar.com")
    });

    test("dob", () => {
        expect(theClient.getDOB()).toStrictEqual(new Date("2000-06-06"))
    });

    test("sex", () => {
        expect(theClient.getSex()).toBe("Female")
    });

    test("maritalStatus", () => {
        expect(theClient.getMaritalStatus()).toBe("Single")
    });

    test("preferredHospital", () => {
        expect(theClient.getPreferredHospital()).toBe("St. Joseph")
    });

    test("primaryInsurance", () => {
        expect(theClient.getPrimaryInsurance()).toStrictEqual(new Insurance("Medical", "12345"))
    });

    test("secondaryInsurance", () => {
        expect(theClient.getSecondaryInsurance()).toStrictEqual(new Insurance("Blue Cross", "67890"))
    });

    test("pcp", () => {
        expect(theClient.getPcp()).toStrictEqual(new ContactInfo("Open Door", "777-777-7777", "456 B St Arcata, CA"))
    });

    test("primaryPhysician", () => {
        expect(theClient.getPrimaryPhysician()).toStrictEqual(new ContactInfo("Dr. Ron Bon", "777-777-8888", "456 B St Arcata, CA"))
    });

    test("medicationList", () => {
        expect(theClient.getMedicationList()).toStrictEqual([
            new Medication("Codine", false, "10mL", "Twice a day", "Cough",
                "None", "Dr. Phil"),
            new Medication("Vitamin D", true, "5mg", "Once a day",
                "Deficiency", "Irritability", "Dr. Foobar")
        ])
    });

    test("likes", () => {
        expect(theClient.getLikes()).toBe("Likes to go on walks. Likes cats. Likes sand")
    });

    test("dislikes", () => {
        expect(theClient.getDislikes()).toBe("Hates cows. Hates cereal. Dislikes milk")
    });

    test("goals", () => {
        expect(theClient.getGoals()).toBe("Go to the moon. Go to Ohio")
    });

    test("hobbies", () => {
        expect(theClient.getHobbies()).toBe("Calculus. Knitting. Video Games")
    });

    test("achievements", () => {
        expect(theClient.getAchievements()).toBe("Won the 2012 Olympic Games in Boxing")
    });

    test("miscNotes", () => {
        expect(theClient.getMiscNotes()).toBe("Known to steal cheese")
    });

    test("supportTeam", () => {
        expect(theClient.getSupportTeam()).toStrictEqual([
            new SupportStaff("Howard Hill", "Worker 2", 123, new Date("2005-05-06"),
                new Date("2012-03-04")),
            new SupportStaff("Nigel Noodle", "Worker 1", 456, new Date("2012-03-04"))
        ])
    });

    test("caseNoteList", () => {
        expect(theClient.getCaseNoteList()).toStrictEqual([
            new CaseNote("Spent all their weekly budget", new Date("2025-01-25"), "Bob Saget",
                false, true),
            new CaseNote("Got into verbal dispute at home", new Date("2023-06-14"),
                "Mary Hawthorn", true, false)
        ])
    });

    test("pictureURL", () => {
        expect(theClient.getPictureURL()).toBe("https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg")
    });

    test("programs", () => {
        expect(theClient.getPrograms()).toStrictEqual([
            new Programs("Bay Center"),
            new Programs("Clinical Services")
        ])
    });
})