import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'groupConfig.json');

class GroupConfigManager {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = fs.readFileSync(CONFIG_FILE, 'utf8');
                if (data.trim()) {
                    this.config = JSON.parse(data);
                }
            }
        } catch (error) {
            console.error('Error loading group config:', error);
            this.config = {};
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving group config:', error);
        }
    }

    ensureGroup(groupId) {
        if (!this.config[groupId]) {
            this.config[groupId] = {
                disabledCommands: [],
                roles: {}, // userId: 'role'
                permissions: {} // role: ['cmd1', 'cmd2']
            };
            this.saveConfig();
        }
    }

    // Command Management
    disableCommand(groupId, commandName) {
        this.ensureGroup(groupId);
        if (!this.config[groupId].disabledCommands.includes(commandName)) {
            this.config[groupId].disabledCommands.push(commandName);
            this.saveConfig();
            return true;
        }
        return false;
    }

    enableCommand(groupId, commandName) {
        this.ensureGroup(groupId);
        const index = this.config[groupId].disabledCommands.indexOf(commandName);
        if (index > -1) {
            this.config[groupId].disabledCommands.splice(index, 1);
            this.saveConfig();
            return true;
        }
        return false;
    }

    isCommandDisabled(groupId, commandName) {
        if (!this.config[groupId]) return false;
        return this.config[groupId].disabledCommands.includes(commandName);
    }

    // Role Management
    setUserRole(groupId, userId, role) {
        this.ensureGroup(groupId);
        this.config[groupId].roles[userId] = role;
        this.saveConfig();
    }

    removeUserRole(groupId, userId) {
        this.ensureGroup(groupId);
        if (this.config[groupId].roles[userId]) {
            delete this.config[groupId].roles[userId];
            this.saveConfig();
            return true;
        }
        return false;
    }

    getUserRole(groupId, userId) {
        if (!this.config[groupId]) return null;
        return this.config[groupId].roles[userId] || null;
    }

    // Permission Management
    // Checks if a user has permission to use a command based on their role in the group
    // Returns: true (allowed), false (explicitly denied/not allowed), or null (no specific rule)
    checkPermission(groupId, userId, commandName) {
        if (!this.config[groupId]) return null;

        const userRole = this.getUserRole(groupId, userId);
        
        // If user has a role, check if that role has specific permissions
        // For now, let's assume 'admin' role has all permissions
        if (userRole === 'admin') return true;
        if (userRole === 'mod') {
            // Mods can't use critical system commands, but can use most group management
            // This logic can be expanded. For now, let's say mods are treated as group admins
            return true; 
        }

        return null; // No specific override
    }
}

export const groupConfig = new GroupConfigManager();
