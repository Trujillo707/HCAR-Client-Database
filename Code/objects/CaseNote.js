/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-26
 * @desc
 * This class holds information for a single Case Note associated with a particular client.
 */
export default class CaseNote {
    #subject = "";
    /** @type {Date} */
    #date = null;
    #postedBy = "";
    #location = "";
    #isBehavioral = false;
    #isInformational = false;

    /**
     * @param {string} subject
     * @param {Date} date
     * @param {string} postedBy
     * @param {string} location
     * @param {boolean} isBehavioral
     * @param {boolean} isInformational
     */
    constructor(subject, date, postedBy, location, isBehavioral, isInformational) {
        this.#subject = subject;
        this.#date = date;
        this.#postedBy = postedBy;
        this.#location = location;
        this.#isBehavioral = isBehavioral;
        this.#isInformational = isInformational;
    }

    getSubject() {
        return this.#subject;
    }

    getDate() {
        return this.#date;
    }

    getPostedBy() {
        return this.#postedBy;
    }

    getLocation() {
        return this.#location;
    }

    getIsBehavioral() {
        return this.#isBehavioral;
    }

    getIsInformational() {
        return this.#isInformational;
    }
}