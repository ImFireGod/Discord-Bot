'use strict';

class Command {
    /**
     * Command class
     */
    constructor (data) {
        this.name = data.name;
        this.aliases = data.aliases || [];
        this.description = data.description;
        this.cooldown = data.cooldown;
        this.permission = data.permission;
        this.category = data.category || "No category";
    }

    /**
     * execute the command
     * @param {Client} client
     * @param {Message} message
     * @param {Array<String>} args
     */
    run (client, message, args) {
        throw new Error(this.name + ' command is not defined');
    }

    /**
     * Check if member have permission to execute the command
     * @param {Client} client
     * @param {GuildMember} member
     * @return {boolean}
     */
    hasPermission (client, member) {
        if (!this.permission) return true;
        if (this.permission === "OWNER") return client.config.owners.indexOf(member.id) !== -1;
        return member.permissions.has(this.permission);
    }

}

module.exports = Command;