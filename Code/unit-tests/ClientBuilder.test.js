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
    let theBuilder;
    beforeAll(() => {
        theBuilder = new ClientBuilder();
    });

    test("firstName", () => {
        let theClient = theBuilder.setFirstName("Alice").build();
        expect(theClient.getFirstName()).toBe("Alice");
    });

    test("middleName", () => {
        let theClient = theBuilder.setMiddleName("Abigail").build();
        expect(theClient.getMiddleName()).toBe("Abigail");
    });

    test("lastName", () => {
        let theClient = theBuilder.setLastName("Auger").build();
        expect(theClient.getLastName()).toBe("Auger");
    });

    test("pronouns", () => {
        let theClient = theBuilder.setPronouns("She/Her").build();
        expect(theClient.getPronouns()).toBe("She/Her");
    });

    test("phoneNumber", () => {
        let theClient = theBuilder.setPhoneNumber("707-777-7777").build();
        expect(theClient.getPhoneNumber()).toBe("707-777-7777");
    });

    test("Address", () => {
        let theClient = theBuilder.setAddress(new Address("123 A St.", "Arcata", "California", "95521")).build();
        expect(theClient.getAddress()).toStrictEqual(new Address("123 A St.", "Arcata", "California", "95521"));
    });

    test("email", () => {
        let theClient = theBuilder.setEmail("alice@foobar.com").build();
        expect(theClient.getEmail()).toBe("alice@foobar.com");
    });

    test("dob", () => {
        let theClient = theBuilder.setDOB(new Date("2000-06-06")).build();
        expect(theClient.getDOB()).toStrictEqual(new Date("2000-06-06"));
    });

    test("sex", () => {
        let theClient = theBuilder.setSex("Female").build();
        expect(theClient.getSex()).toBe("Female");
    });

    test("maritalStatus", () => {
        let theClient = theBuilder.setMaritalStatus("Single").build();
        expect(theClient.getMaritalStatus()).toBe("Single");
    });

    test("preferredHospital", () => {
        let theClient = theBuilder.setPreferredHospital("St. Joseph").build();
        expect(theClient.getPreferredHospital()).toBe("St. Joseph");
    });

    test("primaryInsurance", () => {
        let theClient = theBuilder.setPrimaryInsurance(new Insurance("Medical", "12345")).build();
        expect(theClient.getPrimaryInsurance()).toStrictEqual(new Insurance("Medical", "12345"));
    });

    test("secondaryInsurance", () => {
        let theClient = theBuilder.setSecondaryInsurance(new Insurance("Blue Cross", "67890")).build();
        expect(theClient.getSecondaryInsurance()).toStrictEqual(new Insurance("Blue Cross", "67890"));
    });

    test("pcp", () => {
        let theClient = theBuilder.setPcp(new ContactInfo("Open Door", "777-777-7777", "456 B St Arcata, CA")).build();
        expect(theClient.getPcp()).toStrictEqual(new ContactInfo("Open Door", "777-777-7777", "456 B St Arcata, CA"));
    });

    test("primaryPhysician", () => {
        let theClient = theBuilder.setPrimaryPhysician(new ContactInfo("Dr. Ron Bon", "777-777-8888", "456 B St Arcata, CA")).build();
        expect(theClient.getPrimaryPhysician()).toStrictEqual(new ContactInfo("Dr. Ron Bon", "777-777-8888", "456 B St Arcata, CA"))
    });

    test("medicationList", () => {
        let theClient = theBuilder.setMedicationList([
            new Medication("Codine", false, "10mL", "Twice a day", "Cough",
                "None", "Dr. Phil"),
            new Medication("Vitamin D", true, "5mg", "Once a day",
                "Deficiency", "Irritability", "Dr. Foobar")
        ]).build();
        expect(theClient.getMedicationList()).toStrictEqual([
            new Medication("Codine", false, "10mL", "Twice a day", "Cough",
                "None", "Dr. Phil"),
            new Medication("Vitamin D", true, "5mg", "Once a day",
                "Deficiency", "Irritability", "Dr. Foobar")
        ])
    });

    test("likes", () => {
        let theClient = theBuilder.setLikes("Likes to go on walks. Likes cats. Likes sand").build();
        expect(theClient.getLikes()).toBe("Likes to go on walks. Likes cats. Likes sand");
    });

    test("dislikes", () => {
        let theClient = theBuilder.setDislikes("Hates cows. Hates cereal. Dislikes milk").build();
        expect(theClient.getDislikes()).toBe("Hates cows. Hates cereal. Dislikes milk");
    });

    test("goals", () => {
        let theClient = theBuilder.setGoals("Go to the moon. Go to Ohio").build();
        expect(theClient.getGoals()).toBe("Go to the moon. Go to Ohio");
    });

    test("hobbies", () => {
        let theClient = theBuilder.setHobbies("Calculus. Knitting. Video Games").build();
        expect(theClient.getHobbies()).toBe("Calculus. Knitting. Video Games")
    });

    test("achievements", () => {
        let theClient = theBuilder.setAchievements("Won the 2012 Olympic Games in Boxing").build();
        expect(theClient.getAchievements()).toBe("Won the 2012 Olympic Games in Boxing")
    });

    test("miscNotes", () => {
        let theClient = theBuilder.setMiscNotes("Known to steal cheese").build();
        expect(theClient.getMiscNotes()).toBe("Known to steal cheese")
    });

    test("supportTeam", () => {
        let theClient = theBuilder .setSupportTeam([
            new SupportStaff("Howard Hill", "Worker 2", 123, new Date("2005-05-06"),
                new Date("2012-03-04")),
            new SupportStaff("Nigel Noodle", "Worker 1", 456, new Date("2012-03-04"))
        ]).build();
        expect(theClient.getSupportTeam()).toStrictEqual([
            new SupportStaff("Howard Hill", "Worker 2", 123, new Date("2005-05-06"),
                new Date("2012-03-04")),
            new SupportStaff("Nigel Noodle", "Worker 1", 456, new Date("2012-03-04"))
        ])
    });

    test("caseNoteList", () => {
        let theClient = theBuilder.setCaseNoteList([
            new CaseNote("Spent all their weekly budget", new Date("2025-01-25"), "Bob Saget",
                false, true),
            new CaseNote("Got into verbal dispute at home", new Date("2023-06-14"),
                "Mary Hawthorn", true, false)
        ]).build();
        expect(theClient.getCaseNoteList()).toStrictEqual([
            new CaseNote("Spent all their weekly budget", new Date("2025-01-25"), "Bob Saget",
                false, true),
            new CaseNote("Got into verbal dispute at home", new Date("2023-06-14"),
                "Mary Hawthorn", true, false)
        ])
    });

    test("pictureURL", () => {
        let theClient = theBuilder.setPictureURL("https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg").build();
        expect(theClient.getPictureURL()).toBe("https://upload.wikimedia.org/wikipedia/commons/0/05/Bob_Saget_1987.jpg")
    });

    test("programs", () => {
        let theClient = theBuilder.setPrograms([
            new Programs("Bay Center"),
            new Programs("Clinical Services")
        ]).build();
        expect(theClient.getPrograms()).toStrictEqual([
            new Programs("Bay Center"),
            new Programs("Clinical Services")
        ])
    });
})