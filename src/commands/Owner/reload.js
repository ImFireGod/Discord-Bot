'use strict';

const Command = require ('../../../utils/classes/commands/Command');

class Reload extends Command {
    constructor() {
        super({
            name: "reload",
            aliases: ["rl"],
            description: "Reload specified command",
            permission: "OWNER",
            category: "Administration"
        });
    }

    run (client, message, args) {
        if (!args[0]) return message.channel.send('Please indicate a command to reload');

        const command = client.commandManager.getCommand(args[0].toLowerCase());
        if (!command) return message.channel.send('No command found');

        message.channel.send(`Command ${command.name} ${(client.commandManager.reloadCommand(command.name) ? "reloaded" : "not reloaded")}`)
    }
}

module.exports = Reload;