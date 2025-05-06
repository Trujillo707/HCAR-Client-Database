/**
 * Represents one Medication taken by a Client
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 */
export default class Medication {
    #name = "";
    #prn = false;
    #dosage = "";
    #timesOfDay = "";
    #purpose = "";
    #sideEffects = "";
    #prescriber = "";

    /**
     * Creates a Medication for a particular Client
     * @param {string} name
     * @param {boolean} prn True for Yes, False for No
     * @param {string} dosage
     * @param {string} timesOfDay
     * @param {string} purpose
     * @param {string} sideEffects
     * @param {string} prescriber
     */
    constructor({name, prn, dosage, timesOfDay, purpose, sideEffects, prescriber}) {
        this.#name = name;
        this.#prn = prn;
        this.#dosage = dosage;
        this.#timesOfDay = timesOfDay;
        this.#purpose = purpose;
        this.#sideEffects = sideEffects;
        this.#prescriber = prescriber;
    }

    /** @returns {string} */
    getName() {
        return this.#name;
    }

    /** @returns {boolean} */
    getPrn() {
        return this.#prn;
    }

    /** @returns {string} */
    getDosage() {
        return this.#dosage;
    }

    /** @returns {string} */
    getTimesOfDay() {
        return this.#timesOfDay;
    }

    /** @returns {string} */
    getPurpose() {
        return this.#purpose;
    }

    /** @returns {string} */
    getSideEffects() {
        return this.#sideEffects;
    }

    /** @returns {string} */
    getPrescriber() {
        return this.#prescriber;
    }
}