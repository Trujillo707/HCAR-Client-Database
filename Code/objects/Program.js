/**
 * This class contains data for a single Program a Client or Staff is part of.
 * In-progress, current fields may be added/deleted in future versions
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 */
export class Program {
    #name = "";

    /**
     * @param {string} name
     */
    constructor(name) {
        this.#name = name;
    }

    /** @returns {string} */
    getName(){
        return this.#name;
    }
}