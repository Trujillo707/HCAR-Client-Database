class SupportStaff {
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
    constructor(name, title, idNumber, dateAssigned, dateRemoved = null ) {
        this.#name = name;
        this.#title = title;
        this.#idNumber = idNumber;
        this.#dateAssigned = dateAssigned;
        this.#dateRemoved = dateRemoved;
    }

    get name() {
        return this.#name;
    }

    get title() {
        return this.#title;
    }

    get idNumber() {
        return this.#idNumber;
    }

    get dateAssigned() {
        return this.#dateAssigned;
    }

    get dateRemoved() {
        return this.#dateRemoved;
    }
}
