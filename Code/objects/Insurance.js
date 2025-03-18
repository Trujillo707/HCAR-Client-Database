/**
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-17
 * @desc
 * This class holds data for Insurance objects.
 * Only holds an insurance Name and PolicyNumber
 */
class Insurance{
    #name = "";
    #policyNumber = "";

    /**
     * @param {string} name
     * @param {string} policyNumber
     */
    constructor(name, policyNumber) {
        this.#name = name;
        this.#policyNumber = policyNumber;
    }

    getName(){
        return this.#name;
    }

    getPolicyNumber(){
        return this.#policyNumber;
    }
}