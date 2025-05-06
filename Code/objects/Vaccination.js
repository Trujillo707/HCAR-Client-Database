/**=====
 * Vaccination: an object representing one vaccination, with shot type and date.
 * @author Michael Goodwyn
 * @version 3/30/2025
=====*/

export default class Vaccination {
    #shotType = "";
    /** @type {Date} */
    #dateTaken = null;

    /** Creates a Vaccination for a Client
     * @param {string} shotType
     * @param {Date} dateTaken
     */
    constructor({shotType, dateTaken}) {
        this.#shotType = shotType;
        this.#dateTaken = dateTaken;
    }

    /** @returns {string} */
    getShotType() {
        return this.#shotType;
    }

    /** @returns {Date} */
    getDateTaken() {
        return this.#dateTaken;
    }
}