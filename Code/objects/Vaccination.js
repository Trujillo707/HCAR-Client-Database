/**=====
 * Vaccination: an object representing one vaccination, with shot type and date.
 * @author Michael Goodwyn
 * @version 3/30/2025
=====*/

export default class Vaccination {
    #shotType = "";
    #dateTaken = "";

    /** Creates a Vaccination for a Client
     * @param {string} shotType
     * @param {string} dateTaken
     */
    constructor(shotType, dateTaken) {
        this.#shotType = shotType;
        this.#dateTaken = dateTaken;
    }

    /** @returns {string} */
    getShotType() {
        return this.#shotType;
    }

    /** @returns {string} */
    getDateTaken() {
        return this.#dateTaken;
    }
}