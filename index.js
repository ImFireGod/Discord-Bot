'use strict';

const CommandsManager = require('./utils/classes/commands/CommandsManager');
const DatabaseManager = require('./utils/classes/DatabaseManager');
const { Client } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');

class Bot extends Client {
    constructor () {
        super();

        this.config = require('./config.json');
        this.prefix = this.config.prefix;
        const { database } = this.config;

        this.commandManager = new CommandsManager();
        this.databaseManager = new DatabaseManager(database);
        this._loadEvents();

        this.login(this.config.token);
    }

    _loadEvents() {
        let count = 0;
        const files = readdirSync(join(__dirname, 'src/events'));
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            try {
                count++;
                const fileName = file.split('.js')[0];
                const event = require(join(__dirname, "src/events", file));
                this.on(fileName, event.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "src/events", file))];
            } catch (e) {
                console.log(`[Events] Failed to load event ${file}: ${e.stack || e}`);
            }
        }
        console.log(`[Events] ${count}/${files.length} events loaded`);
    }
}

module.exports = new Bot();