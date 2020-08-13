'use strict';

const cooldownOptions = {
    clearAllAfterCacheSize: false,
    maxCacheSize: -1
}

/**
 * @example
 * const cooldown = new CooldownManager({
 *   clearAllAfterCacheSize: false,
 *   maxCacheSize: -1
 * });
 */
class CooldownManager {
    constructor (options = {}) {
        for(const key in cooldownOptions) {
            if (!options.hasOwnProperty(key) || typeof options[key] === 'undefined' || options[key] === null) {
                options[key] = cooldownOptions[key];
            }
        }
        this.cooldowns = new Map();
        this.options = options;
    }

    setCooldown (id, command, duration) {
        if(!this.cooldowns.has(id)) this.cooldowns.set(id, []);
        const user = this.cooldowns.get(id);
        user.push({name: command, timestamp: Date.now() + duration});
        this.clearCooldowns(id);
        if(this.options.maxCacheSize > 0 && this.cooldowns.size >= this.options.maxCacheSize) {
            this.options.clearAllAfterCacheSize ? this.cooldowns.clear() : this.checkAllCooldowns();
        }
    }

    getRemainingTime (id, command) {
        if (!this.cooldowns.has(id)) return 0;
        const cooldown = this.cooldowns.get(id).find(c => c.name === command);
        if (cooldown) return cooldown.timestamp - Date.now();
        return 0;
    }

    canUse (id, command) {
        if(this.cooldowns.has(id)) {
            const cooldown = this.cooldowns.get(id).find(c => c.name === command);
            if (cooldown) {
                return cooldown.timestamp <= Date.now();
            }
        }
        return true;
    }

    clearCooldowns (id) {
        if (this.cooldowns.has(id)) {
            if (this.cooldowns.get(id).length > 0) {
                this.cooldowns.set(id, this.cooldowns.get(id).filter(c => c.timestamp > Date.now()));
            } else {
                this.cooldowns.delete(id);
            }
        }
    }

    checkAllCooldowns () {
        this.cooldowns.forEach((user) => {
            this.clearCooldowns(user);
        });
    }
}

module.exports = CooldownManager;