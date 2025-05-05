/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 * @desc
 * This class holds information for any individuals considered "SupportStaff" for an HCAR Client.
 */
export class SupportStaff {
    #name = "";
    #title = "";
    #idNumber = 0;
    /**
     * Should never be null if the other Date is not null!
     * @type {Date}
     */
    #dateAssigned = null;
    /**
     * This value shall not be null if [dateAssigned]{@link SupportStaff.#dateAssigned} is non-null!
     * @type {Date}
     */
    #dateRemoved = null;

    /**
     *
     * @param {string} name
     * @param {string} title
     * @param {number} idNumber
     * @param {Date} dateAssigned
     * @param {Date} [dateRemoved = null]
     */
    constructor({name, title, idNumber, dateAssigned, dateRemoved} ) {
        this.#name = name;
        this.#title = title;
        this.#idNumber = idNumber;
        this.#dateAssigned = dateAssigned;
        this.#dateRemoved = dateRemoved;
    }

    getName() {
        return this.#name;
    }

    getTitle() {
        return this.#title;
    }

    getIdNumber() {
        return this.#idNumber;
    }

    getDateAssigned() {
        return this.#dateAssigned;
    }

    getDateRemoved() {
        return this.#dateRemoved;
    }
}
