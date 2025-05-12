/**
 * @author Orlando Trujillo-Ortiz, Michael Goodwyn
 * @version 2025-04-27
 * @desc
 * This class holds information for a single Case Note associated with a particular client.
 */
export default class CaseNote {
    #noteID = -1;
    #subject = "";
    #programName = "";
    /** @type {Date} */
    #dateCreated = null;
    #contactType = {
        IN_PERSON: "In-Person",
        WRITTEN: "written",
        OVER_THE_PHONE: "overThePhone"
    };
    #goal = {
        ISP_GOAL: "ISP Goal",
        IPP_GOAL: "IPP Goal",
        PERSONAL_GOAL: "Personal Goal"
    };
    #narrative = "";
    #goalProgress = "";
    #nextSteps = "";
    #employeeSign = "";
    /** @type {Date} */
    #signDate = null;
    /** @type {Date} */
    #dateOfEvent = null;

    /**
     * @param {number} noteID
     * @param {string} subject
     * @param {string} programName
     * @param {Date} dateCreated
     * @enum {string} contactType
     * @enum {string} goal
     * @param {string} narrative
     * @param {string} goalProgress
     * @param {string} nextSteps
     * @param {string} employeeSign
     * @param {Date} signDate
     * @param {Date} dateOfEvent
     */
    constructor({noteID, subject, programName, dateCreated, contactType, goal, narrative,
                goalProgress, nextSteps, employeeSign, signDate, dateOfEvent}) {
        this.#noteID = noteID;
        this.#subject = subject;
        this.#programName = programName;
        this.#dateCreated = dateCreated;
        this.#contactType = contactType;
        this.#goal = goal;
        this.#narrative = narrative;
        this.#goalProgress = goalProgress;
        this.#nextSteps = nextSteps;
        this.#employeeSign = employeeSign;
        this.#signDate = signDate;
        this.#dateOfEvent = dateOfEvent;
    }
    

    getNoteID() {
        return this.#noteID;
    }

    getSubject() {
        return this.#subject;
    }

    getProgram() {
        return this.#programName;
    }

    getDateCreated() {
        return this.#dateCreated;
    }

    getContactType() {
        return this.#contactType;
    }

    getGoalWorkedOn() {
        return this.#goal;
    }

    getNarrative() {
        return this.#narrative;
    }

    getProgressOnGoal() {
        return this.#goalProgress;
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

    getDateOfEvent() {
        return this.#dateOfEvent;
    }
}