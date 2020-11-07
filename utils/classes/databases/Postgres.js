'use strict';

const { Pool } = require('pg');

class DatabaseManager {
    #pool;
    constructor(host, port, user, database, password) {
        this.#pool = new Pool({
            host, port, user, database, password
        });
    }

    /**
     * Do prepared request
     * @param {String} request
     * @param {String} values
     */
    async preparedRequest (request, ...values) {
        return await this.#pool.query(
            request, values.flat(1)
        );
    }

    /**
     * Do simple request
     * @param request
     * @return {Promise<void>}
     * @deprecated
     */
    async request (request) {
        return await this.#pool.query(request);
    }
}

module.exports = DatabaseManager;