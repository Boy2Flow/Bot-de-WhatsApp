
import { config } from '../config/privilegedUsers.js';

const testNumber = '34613762515@s.whatsapp.net';
const cleanTestNumber = '34613762515';

console.log('--- DEBUG SUPER ADMIN ---');
console.log('Testing number:', testNumber);
console.log('Current superAdmins list:', JSON.stringify(config.superAdmins, null, 2));

const isSuper = config.isSuperAdmin(testNumber);
console.log('Is Super Admin (Full ID)?', isSuper);

const isSuperClean = config.isSuperAdmin(cleanTestNumber);
console.log('Is Super Admin (Clean ID)?', isSuperClean);

// Check manual comparison
const found = config.superAdmins.some(admin => {
    const adminClean = admin.split('@')[0].split(':')[0];
    const userClean = testNumber.split('@')[0].split(':')[0];
    console.log(`Comparing: Admin(${adminClean}) === User(${userClean})`);
    return adminClean === userClean;
});
console.log('Manual check result:', found);
console.log('-------------------------');
