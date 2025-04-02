export default class Address {
    #streetAddress = "";
    #city = "";
    #state = "";
    #zip = "";

    /**
     *
     * @param {string} streetAddress
     * @param {string} city
     * @param {string} state
     * @param {string} zip
     */
    constructor(streetAddress, city, state, zip) {
        this.#streetAddress = streetAddress;
        this.#city = city;
        this.#state = state;
        this.#zip = zip;
    }

    getStreetAddress() {
        return this.#streetAddress;
    }

    getCity() {
        return this.#city;
    }

    getState() {
        return this.#state;
    }

    getZip() {
        return this.#zip;
    }
}