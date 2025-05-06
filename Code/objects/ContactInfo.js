/** Simple class to hold basic contact information
 * @author Orlando Trujillo-Ortiz
 * @version 2025-03-26
 */
export default class ContactInfo {
    #name = "";
    #phoneNumber = "";
    #address = "";

    /**
     * Creates a ContactInfo object
     * @param {string} name
     * @param {string} phoneNumber
     * @param {string} address
     */
    constructor({name, phoneNumber, address}) {
        this.#name = name;
        this.#phoneNumber = phoneNumber;
        this.#address = address;
    }

    getName(){
        return this.#name;
    }

    getPhoneNumber(){
        return this.#phoneNumber;
    }

    getAddress(){
        return this.#address;
    }
}