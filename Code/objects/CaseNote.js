/**
 * @author Orlando Trujillo-Ortiz, Michael Goodwyn
 * @version 2025-04-27
 * @desc
 * This class holds information for a single Case Note associated with a particular client.
 */
export default class CaseNote {
    #subject = "";
    #program = "";
    /** @type {Date} */
    #date = null;
    #contactType = {
        IN_PERSON: "inPerson",
        WRITTEN: "written",
        OVER_THE_PHONE: "overThePhone"
    };
    #goalWorkedOn = {
        ISP_GOAL: "ISP Goal",
        IPP_GOAL: "IPP Goal",
        PERSONAL_GOAL: "Personal Goal"
    };
    #narrative = "";
    #progressOnGoal = "";
    #nextSteps = "";
    #employeeSign = "";
    /** @type {Date} */
    #signDate = null;

    /**
     * @param {string} subject
     * @param {string} program
     * @param {Date} date
     * @enum {string} contactType
     * @enum {string} goalWorkedOn
     * @param {string} narrative
     * @param {string} progressOnGoal
     * @param {string} nextSteps
     * @param {string} employeeSign
     * @param {Date} signDate
     */
    constructor({subject, program, date, contactType, goalWorkedOn, narrative,
                progressOnGoal, nextSteps, employeeSign, signDate}) {
        this.#subject = subject;
        this.#program = program;
        this.#date = date;
        this.#contactType = contactType;
        this.#goalWorkedOn = goalWorkedOn;
        this.#narrative = narrative;
        this.#progressOnGoal = progressOnGoal;
        this.#nextSteps = nextSteps;
        this.#employeeSign = employeeSign;
        this.#signDate = signDate;
    }

    getSubject() {
        return this.#subject;
    }

    getProgram() {
        return this.#program;
    }

    getDate() {
        return this.#date;
    }

    getContactType() {
        return this.#contactType;
    }

    getGoalWorkedOn() {
        return this.#goalWorkedOn;
    }

    getNarrative() {
        return this.#narrative;
    }

    getProgressOnGoal() {
        return this.#progressOnGoal;
    }

    getNextSteps() {
        return this.#nextSteps;
    }

    getEmployeeSign() {
        return this.#employeeSign;
    }

    getSignDate() {
        return this.#signDate;
    }
}