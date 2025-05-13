/**
 * This class contains all of the programs a Client or Staff is part of.
 * In-progress, current fields may be added/deleted in future versions
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 */
export default class Programs {
    #names = "";

    /**
     * @param {string[]} names
     */
    constructor({names}) {
        this.#names = names;
    }

    /** @returns {string[]} */
    getNames(){
        return this.#names;
    }
}