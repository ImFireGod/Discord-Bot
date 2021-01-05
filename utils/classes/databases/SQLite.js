'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
    constructor (databaseName) {
        if (!fs.existsSync(path.join(__dirname, "../../../database"))) {
            try {
                fs.mkdirSync(path.join(__dirname, "../../../database"));
            } catch (e) {
                return console.error(["Database"], "An error has occured while create database\n", e);
            }
            console.log(["Database"], "Creating new folder");
        }
        this.db = new Database(path.join(__dirname, "../../../database" , databaseName))
    }
}

module.exports = DatabaseManager;
