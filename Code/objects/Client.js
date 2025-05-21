import Address from "./Address.js";

/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 * @desc
 * Class for Client data. Immutable for the most part.
 * Users can technically mutate the arrays, but that is an acceptable risk.
 */
export class Client {
    // Keep these private to prevent any changes!
    #clientID = -1;
    #firstName = "";
    #middleName = "";
    #lastName = "";
    #pronouns = "";
    #phoneNumber = "";
    /** @type {Address} */
    #address = null;
    #email = "";
    /** @type {Date}*/
    #DOB = null;
    #sex = "";
    #maritalStatus = "";
    #preferredHospital = "";
    /** @type {Insurance} */
    #primaryInsurance = null;
    /** @type {Insurance} */
    #secondaryInsurance = null;
    /** @type {ContactInfo} */
    #pcp = null;
    /** @type {ContactInfo} */
    #primaryPhysician = null;
    /** @type {Medication[]} */
    #medicationList = [];
    #vaccinationList = [];
    #likes = "";
    #dislikes = "";
    #goals = "";
    #hobbies = "";
    #achievements = "";
    #miscNotes = "";
    /** @type {SupportStaff[]} */
    #supportTeam = [];
    /** @type {CaseNote[]} */
    #caseNoteList = [];
    #pictureURL = "";
    /** @type {String[]} */
    #programs = [];
    /** @type {Date} */
    #POS = null;
    #gender = "";

    /**
     * Client instances are to be created via a ClientBuilder object only.
     * These Client objects are intended to be treated as immutable.
     * @param {ClientBuilder} builder
     */
    constructor( builder ) {
        this.#clientID = builder.clientID;
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
        this.#vaccinationList = builder.vaccinationList;
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
        this.#POS = builder.POS;
        this.#gender = builder.gender;
    }

    /** @returns {number} */
    getClientID() {
        return this.#clientID;
    }

    /** @returns {string} */
    getFirstName() {
        return this.#firstName;
    }

    /** @returns {string} */
    getMiddleName() {
        return this.#middleName;
    }

    /** @returns {string} */
    getLastName() {
        return this.#lastName;
    }

    /** @returns {string} */
    getPronouns(){
        return this.#pronouns;
    }

    /** @returns {string} */
    getPhoneNumber() {
        return this.#phoneNumber;
    }

    /** @returns {Address} */
    getAddress() {
        return this.#address;
    }

    /** @returns {string} */
    getEmail() {
        return this.#email;
    }

    /** @returns {Date} */
    getDOB() {
        return this.#DOB;
    }

    /** @returns {string} */
    getSex() {
        return this.#sex;
    }

    /** @returns {string} */
    getMaritalStatus() {
        return this.#maritalStatus;
    }

    /** @returns {string} */
    getPreferredHospital() {
        return this.#preferredHospital;
    }

    /** @returns {Insurance} */
    getPrimaryInsurance() {
        return this.#primaryInsurance;
    }

    /** @returns {Insurance} */
    getSecondaryInsurance() {
        return this.#secondaryInsurance;
    }

    /** @returns {ContactInfo} */
    getPcp() {
        return this.#pcp;
    }

    /** @returns {ContactInfo} */
    getPrimaryPhysician() {
        return this.#primaryPhysician;
    }

    /** @returns {Medication[]} */
    getMedicationList() {
        return this.#medicationList;
    }

    /** @returns {Vaccination[]} */
    getVaccinationList() {
        return this.#vaccinationList;
    }

    /** @returns {string} */
    getLikes() {
        return this.#likes;
    }

    /** @returns {string} */
    getDislikes() {
        return this.#dislikes;
    }

    /** @returns {string} */
    getGoals() {
        return this.#goals;
    }

    /** @returns {string} */
    getHobbies() {
        return this.#hobbies;
    }

    /** @returns {string} */
    getAchievements() {
        return this.#achievements;
    }

    /** @returns {string} */
    getMiscNotes() {
        return this.#miscNotes;
    }

    /** @returns {SupportStaff[]} */
    getSupportTeam() {
        return this.#supportTeam;
    }

    /** @returns {CaseNote[]} */
    getCaseNoteList() {
        return this.#caseNoteList;
    }

    /** @returns {string} */
    getPictureURL() {
        return this.#pictureURL;
    }

    /** @returns {Programs} */
    getPrograms(){
        return this.#programs;
    }

    /** @returns {Date} */
    getPOS() {
        return this.#POS;
    }

    /** @returns {string} */
    getGender(){
        return this.#gender;
    }
}
