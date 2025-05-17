/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 * @desc
 * This class holds data for Insurance objects.
 * Only holds an insurance Name and PolicyNumber
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-26
 */
export default class Insurance{
    #id = "";
    #name = "";
    #policyNumber = "";

    /**
     * @param {number} id
     * @param {string} name
     * @param {string} policyNumber
     */
    constructor({id, name, policyNumber}) {
        this.#id = id;
        this.#name = name;
        this.#policyNumber = policyNumber;
    }

    getName(){
        return this.#name;
    }

    getPolicyNumber(){
        return this.#policyNumber;
    }

    getID(){
        return this.#id;
    }
}