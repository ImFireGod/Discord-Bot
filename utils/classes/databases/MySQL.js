'use strict';

const mysql = require('mysql2/promise');

class DatabaseManager {
    #pool;
    constructor(host, user, database, password, port) {
        this.#pool = mysql.createPool({
            host, user, database, password, port,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    /**
     * Do prepared request
     * @param {String} request
     * @param {?} values
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