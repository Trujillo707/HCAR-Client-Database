import { Client } from "./Client.js"

/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 * @desc Class ClientBuilder is responsible for creating Client objects and ensuring the inputted data is valid.
 *       Default values for Client class are enforced here. Unprovided values are given a safe default empty data.
 */
class ClientBuilder {
    // Public fields for building
    firstName = "";
    middleName = "";
    lastName = "";
    pronouns = "";
    phoneNumber = "";
    address = "";
    email = "";
    DOB = null;
    sex = "";
    maritalStatus = "";
    preferredHospital = "";
    /**
     * @type {Insurance}
     */
    primaryInsurance = null;
    /**
     * @type {Insurance}
     */
    secondaryInsurance = null;
    pcp = null;
    primaryPhysician = null;
    medicationList = [];
    likes = "";
    dislikes = "";
    goals = "";
    hobbies = "";
    achievements = "";
    miscNotes = "";
    supportTeam = [];
    caseNoteList = [];
    pictureURL = "";
    programs = [];

    // Builder methods
    setFirstName(firstName) {
        this.firstName = firstName;
        return this;
    }

    setMiddleName(middleName) {
        this.middleName = middleName;
        return this;
    }

    setLastName(lastName) {
        this.lastName = lastName;
        return this;
    }

    setPronouns(pronouns){
        this.pronouns = pronouns;
        return this;
    }

    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    setAddress(address) {
        this.address = address;
        return this;
    }

    setEmail(email) {
        this.email = email;
        return this;
    }

    setDOB(dob) {
        this.DOB = dob;
        return this;
    }

    setSex(sex) {
        this.sex = sex;
        return this;
    }

    setMaritalStatus(maritalStatus) {
        this.maritalStatus = maritalStatus;
        return this;
    }

    setPreferredHospital(preferredHospital) {
        this.preferredHospital = preferredHospital;
        return this;
    }

    setPrimaryInsurance(primaryInsurance) {
        this.primaryInsurance = primaryInsurance;
        return this;
    }

    setSecondaryInsurance(secondaryInsurance) {
        this.secondaryInsurance = secondaryInsurance;
        return this;
    }

    setPcp(pcp) {
        this.pcp = pcp;
        return this;
    }

    setPrimaryPhysician(primaryPhysician) {
        this.primaryPhysician = primaryPhysician;
        return this;
    }

    setMedicationList(medicationList) {
        this.medicationList = medicationList;
        return this;
    }

    setLikes(likes) {
        this.likes = likes;
        return this;
    }

    setDislikes(dislikes) {
        this.dislikes = dislikes;
        return this;
    }

    setGoals(goals) {
        this.goals = goals;
        return this;
    }

    setHobbies(hobbies) {
        this.hobbies = hobbies;
        return this;
    }

    setAchievements(achievements) {
        this.achievements = achievements;
        return this;
    }

    setMiscNotes(miscNotes) {
        this.miscNotes = miscNotes;
        return this;
    }

    setSupportTeam(supportTeam) {
        this.supportTeam = supportTeam;
        return this;
    }

    setCaseNoteList(caseNoteList) {
        this.caseNoteList = caseNoteList;
        return this;
    }

    setPictureURL(pictureURL) {
        this.pictureURL = pictureURL;
        return this;
    }

    setPrograms(programs){
        this.programs = programs;
        return this;
    }

    build() {
        return new Client(this);
    }
}

export { ClientBuilder};