'use strict';

module.exports = (client, message) => {
    if (!message.guild
        || message.author.bot
        || !message.channel.permissionsFor(client.user).has('SEND_MESSAGES')
        || !message.content.startsWith(client.prefix)
    ) return;

    let args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = client.commandManager.getCommand(args.shift());
    if (!command) return;

    client.commandManager.useCommand(client, message, args, command);
}