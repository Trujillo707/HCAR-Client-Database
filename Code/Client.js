/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 * @desc
 * Class for Client data. Immutable for the most part.
 * Users can technically mutate the arrays, but that is an acceptable risk.
 */
class Client {
    // Keep these private to prevent any changes!
    #firstName = "";
    #middleName = "";
    #lastName = "";
    #pronouns = "";
    #phoneNumber = "";
    #address = "";
    #email = "";
    #DOB = null;
    // TODO: Consider adding gender as field
    #sex = "";
    #maritalStatus = "";
    #preferredHospital = "";
    #primaryInsurance = null;
    #secondaryInsurance = null;
    #pcp = null;
    #primaryPhysician = null;
    #medicationList = [];
    #likes = "";
    #dislikes = "";
    #goals = "";
    #hobbies = "";
    #achievements = "";
    #miscNotes = "";
    #supportTeam = [];
    #caseNoteList = [];
    #pictureURL = "";
    #programs = [];

    constructor( builder ) {
        this.#firstName = builder.firstName;
        this.#middleName = builder.middleName;
        this.#lastName = builder.lastName;
        this.#pronouns = builder.pronouns;
        this.#phoneNumber = builder.phoneNumber;
        this.#address = builder.address;
        this.#email = builder.email;
        this.#DOB = builder.DOB;
        this.#sex = builder.sex;
        this.#maritalStatus = builder.maritalStatus;
        this.#preferredHospital = builder.preferredHospital;
        this.#primaryInsurance = builder.primaryInsurance;
        this.#secondaryInsurance = builder.secondaryInsurance;
        this.#pcp = builder.pcp;
        this.#primaryPhysician = builder.primaryPhysician;
        this.#medicationList = builder.medicationList;
        this.#likes = builder.likes;
        this.#dislikes = builder.dislikes;
        this.#goals = builder.goals;
        this.#hobbies = builder.hobbies;
        this.#achievements = builder.achievements;
        this.#miscNotes = builder.miscNotes;
        this.#supportTeam = builder.supportTeam;
        this.#caseNoteList = builder.caseNoteList;
        this.#pictureURL = builder.pictureURL;
        this.#programs = builder.programs;
    }

    getFirstName() {
        return this.#firstName;
    }

    getMiddleName() {
        return this.#middleName;
    }

    getLastName() {
        return this.#lastName;
    }

    getPronouns(){
        return this.#pronouns;
    }

    getPhoneNumber() {
        return this.#phoneNumber;
    }

    getAddress() {
        return this.#address;
    }

    getEmail() {
        return this.#email;
    }

    getDOB() {
        return this.#DOB;
    }

    getSex() {
        return this.#sex;
    }

    getMaritalStatus() {
        return this.#maritalStatus;
    }

    getPreferredHospital() {
        return this.#preferredHospital;
    }

    getPrimaryInsurance() {
        return this.#primaryInsurance;
    }

    getSecondaryInsurance() {
        return this.#secondaryInsurance;
    }

    getPcp() {
        return this.#pcp;
    }

    getPrimaryPhysician() {
        return this.#primaryPhysician;
    }

    getMedicationList() {
        return this.#medicationList;
    }

    getLikes() {
        return this.#likes;
    }

    getDislikes() {
        return this.#dislikes;
    }

    getGoals() {
        return this.#goals;
    }

    getHobbies() {
        return this.#hobbies;
    }

    getAchievements() {
        return this.#achievements;
    }

    getMiscNotes() {
        return this.#miscNotes;
    }

    getSupportTeam() {
        return this.#supportTeam;
    }

    getCaseNoteList() {
        return this.#caseNoteList;
    }

    getPictureURL() {
        return this.#pictureURL;
    }

    getPrograms(){
        return this.#programs;
    }
}

export { Client };
