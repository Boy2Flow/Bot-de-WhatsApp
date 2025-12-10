import fs from 'fs';
import path from 'path';

const KEYS_FILE = path.join(process.cwd(), 'keys.json');

export const getKey = (service) => {
    if (!fs.existsSync(KEYS_FILE)) return null;
    try {
        const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
        return keys[service];
    } catch (e) {
        return null;
    }
};

export const setKey = (service, key) => {
    let keys = {};
    if (fs.existsSync(KEYS_FILE)) {
        try {
            keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
        } catch (e) { }
    }
    keys[service] = key;
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
};
