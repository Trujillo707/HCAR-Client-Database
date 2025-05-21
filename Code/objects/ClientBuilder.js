import {Client} from "./Client.js"
import Programs from "./Programs.js";
import Address from "./Address.js";
import Medication from "./Medication.js";

/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-26
 * @desc Class ClientBuilder is responsible for creating Client objects and ensuring the inputted data is valid.
 *       Default values for Client class are enforced here. Unprovided values are given a safe default empty data.
 *       Observe that there is no constructor specified, so default one is used!
 */
export class ClientBuilder {
    // Public fields for building

    /** @type {number} */
    clientID = -1;
    /** @type {string} */
    firstName = "";
    /** @type {string} */
    middleName = "";
    /** @type {string} */
    lastName = "";
    /** @type {string} */
    pronouns = "";
    /** @type {string} */
    phoneNumber = "";
    /** @type {Address}*/
    address = null;
    /** @type {string} */
    email = "";
    /** @type {Date} */
    DOB = null;
    /** @type {string} */
    sex = "";
    /** @type {string} */
    maritalStatus = "";
    /** @type {string} */
    preferredHospital = "";
    /** @type {Insurance} */
    primaryInsurance = null;
    /** @type {Insurance} */
    secondaryInsurance = null;
    /** @type {ContactInfo} */
    pcp = null;
    /** @type {ContactInfo} */
    primaryPhysician = null;
    /** @type {Medication[]} */
    medicationList = [];
    /** @type{Vaccination[]} */
    vaccinationList = [];
    /** @type {string} */
    likes = "";
    /** @type {string} */
    dislikes = "";
    /** @type {string} */
    goals = "";
    /** @type {string} */
    hobbies = "";
    /** @type {string} */
    achievements = "";
    /** @type {string} */
    miscNotes = "";
    /** @type {SupportStaff[]} */
    supportTeam = [];
    /** @type {CaseNote[]} */
    caseNoteList = [];
    /** @type {string} */
    pictureURL = "";
    /** @type {string[]} */
    programs = [];
    /** @type {Date} */
    POS = null;
    /** @type {string} */
    gender = "";

    // Builder methods

    /**
     * @param {number} clientID
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setClientID(clientID) {
        this.clientID = clientID;
        return this;
    }

    /**
     *
     * @param {string} firstName
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setFirstName(firstName) {
        this.firstName = firstName;
        return this;
    }

    /**
     * @param {string} middleName
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setMiddleName(middleName) {
        this.middleName = middleName;
        return this;
    }

    /**
     * @param {string} lastName
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setLastName(lastName) {
        this.lastName = lastName;
        return this;
    }

    /**
     * @param {string} pronouns
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPronouns(pronouns){
        this.pronouns = pronouns;
        return this;
    }

    /** @param {string} phoneNumber
     *  @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    /**
     * @param {Address} address
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setAddress(address) {
        this.address = address;
        return this;
    }

    /**
     * @param {string} email
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setEmail(email) {
        this.email = email;
        return this;
    }

    /**
     * @param {Date} dob
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setDOB(dob) {
        this.DOB = dob;
        return this;
    }

    /**
     * @param {string} sex
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setSex(sex) {
        this.sex = sex;
        return this;
    }

    /**
     * @param {string} maritalStatus
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setMaritalStatus(maritalStatus) {
        this.maritalStatus = maritalStatus;
        return this;
    }

    /**
     * @param {string} preferredHospital
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPreferredHospital(preferredHospital) {
        this.preferredHospital = preferredHospital;
        return this;
    }

    /**
     * @param {Insurance} primaryInsurance
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPrimaryInsurance(primaryInsurance) {
        this.primaryInsurance = primaryInsurance;
        return this;
    }

    /**
     * @param {Insurance} secondaryInsurance
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setSecondaryInsurance(secondaryInsurance) {
        this.secondaryInsurance = secondaryInsurance;
        return this;
    }

    /**
     * @param {ContactInfo} pcp
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPcp(pcp) {
        this.pcp = pcp;
        return this;
    }

    /**
     * @param {ContactInfo} primaryPhysician
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPrimaryPhysician(primaryPhysician) {
        this.primaryPhysician = primaryPhysician;
        return this;
    }

    /**
     * @param {Medication[]} medicationList
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setMedicationList(medicationList) {
        this.medicationList = medicationList;
        return this;
    }

    /**
     * @param {Vaccination[]} vaccinationList
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining
     */
    setVaccinationList(vaccinationList) {
        this.vaccinationList = vaccinationList;
        return this;
    }

    /**
     * @param {string} likes
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setLikes(likes) {
        this.likes = likes;
        return this;
    }

    /**
     * @param {string} dislikes
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setDislikes(dislikes) {
        this.dislikes = dislikes;
        return this;
    }

    /**
     * @param {string} goals
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setGoals(goals) {
        this.goals = goals;
        return this;
    }

    /**
     * @param {string} hobbies
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setHobbies(hobbies) {
        this.hobbies = hobbies;
        return this;
    }

    /**
     * @param {string} achievements
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setAchievements(achievements) {
        this.achievements = achievements;
        return this;
    }

    /**
     * @param {string} miscNotes
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setMiscNotes(miscNotes) {
        this.miscNotes = miscNotes;
        return this;
    }

    /**
     * @param {SupportStaff[]}supportTeam
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setSupportTeam(supportTeam) {
        this.supportTeam = supportTeam;
        return this;
    }

    /**
     * @param {CaseNote[]} caseNoteList Array of [CaseNotes]{@link CaseNote} for this Client
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setCaseNoteList(caseNoteList) {
        this.caseNoteList = caseNoteList;
        return this;
    }

    /**
     * @param {string} pictureURL
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPictureURL(pictureURL) {
        this.pictureURL = pictureURL;
        return this;
    }

    /**
     * @param {Programs} programs
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPrograms(programs){
        this.programs = programs;
        return this;
    }

    /**
     * @param pos
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setPOS(pos){
        this.POS = pos;
        return this;
    }

    /**
     * @param gender
     * @returns {ClientBuilder} Returns this current ClientBuilder to allow method chaining.
     */
    setGender(gender){
        this.gender = gender;
        return this;
    }

    /**
     * @returns {Client} Returns a new [Client]{@link Client} object according to the executed setters before calling this method.
     */
    build() {
        return new Client(this);
    }
}