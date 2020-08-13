'use strict';

const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const Command = require('./Command');
const CooldownManager = require('../CooldownManager');

class CommandsManager {
    constructor () {
        this.cooldownManager = new CooldownManager();
        this.commands = new Collection();
        this.reloadCommands();
    }

    /**
     * Get a command from manager
     * @param {String} name
     * @return {Command|undefined}
     */
    getCommand (name) {
        return this.commands.get(name) || this.commands.find(command => command.aliases.indexOf(name) !== -1);
    }

    /**
     * Check if user can use command
     * @param id
     * @param commandName
     * @return {boolean}
     */
    _canUseCommand (id, commandName) {
        return this.cooldownManager.canUse(id, commandName);
    }

    /**
     * Get remaining time of command
     * @param id
     * @param commandName
     * @return {number}
     */
    _getRemainingTime (id, commandName) {
        return this.cooldownManager.getRemainingTime(id, commandName);
    }

    /**
     * Use a command for user
     * @param {Client} client
     * @param {Message} message
     * @param {Array<String>} args
     * @param {Command} command
     */
    useCommand (client, message, args, command) {
        if (!command.hasPermission(client, message.member)) return message.channel.send("You don't have the permission to execute " + command.name);

        if (command.cooldown && !this._canUseCommand(message.author.id, command.name)) {
            message.channel.send(`Please wait \`${(this._getRemainingTime(message.author.id, command.name) / 1000).toFixed(1)}s\` before use command ` + command.name);
        } else {
            if (command.cooldown) this.cooldownManager.setCooldown(message.author.id, command.name, command.cooldown);
            try {
                command.run(client, message, args)
            } catch (e) {
                message.channel.send('An error has occurred during processing command ' + (e.stack || e));
            }
        }
    }

    /**
     * Reload a command
     * @param name
     * @return {boolean}
     */
    reloadCommand (name) {
        const commandFile = this.getCommandFile(name);
        if (!commandFile) return false;
        delete require.cache[require.resolve(join(__dirname, "../../../src/commands", commandFile.folder, commandFile.file))];
        this.commands.set(commandFile.command.name, commandFile.command);
        return true;
    }

    /**
     * Get command file from commands folder
     * @param commandName
     * @return {{folder: string, command: Command, file: string}|undefined}
     */
    getCommandFile (commandName) {
        const folders = readdirSync(join(__dirname, '../../../src/commands'));
        for (const folder of folders) {
            const commands = readdirSync(join(__dirname, '../../../src/commands', folder));
            for (const file of commands) {
                if (!file.endsWith('.js')) continue;
                try {
                    const command = new (require(join(__dirname, "../../../src/commands", folder, file))) ();
                    if (command.name === commandName) return { command, folder, file };
                } catch (e) {
                    console.log('[Commands] Cannot get command ' + file);
                }
            }
        }
        return undefined;
    }

    /**
     * Reload all commands
     * @param removeCache
     */
    reloadCommands (removeCache) {
        let count = 0;
        const folders = readdirSync(join(__dirname, '../../../src/commands'));
        if (folders.length === 0) return console.log('[CommandHandler] 0 Folder found in folder commands');
        for (const folder of folders) {
            const commands = readdirSync(join(__dirname, '../../../src/commands', folder));
            for (const file of commands) {
                if (!file.endsWith('.js')) continue;
                try {
                    count++;
                    if (removeCache) delete require.cache[require.resolve(join(__dirname, "../../../src/commands", folder, file))];
                    const command = new (require(join(__dirname, "../../../src/commands", folder, file))) ();
                    if (!command.name) {
                        console.log(`[Commands] Command ${file} don't have name.`);
                        continue;
                    }

                    this.commands.set(command.name, command);
                } catch (e) {
                    console.log(`[Commands] Failed to load command ${file}: ${e.stack || e}`);
                }
            }
        }
        console.log(`[Commands] ${this.commands.size}/${count} commands loaded`);
    }
}

module.exports = CommandsManager;