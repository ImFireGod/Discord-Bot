'use strict';

const Command = require ('../../../utils/classes/commands/Command');

class Help extends Command {
    constructor() {
        super({
            name: "help",
            aliases: ["aide", "h"],
            description: "Display help command",
            cooldown: 5000,
            category: "Utils"
        });
    }

    run (client, message, args) {
        const commands = client.commandManager.commands;
        const categories = [...new Set(commands.map(command => command.category))];

        message.channel.send({
            embed: {
                color: 0x12c5e0,
                author: {
                    icon_url: message.author.avatarURL(),
                    name: client.user.username + " commands"
                },
                fields: categories.map(category => {
                    const categoryCommands = commands.filter(command => command.category === category);
                    return {
                        name: category,
                        value: categoryCommands.map(command => `\`${command.name}\``).join(', ')
                    }
                })
            }
        });
    }
}

module.exports = Help;