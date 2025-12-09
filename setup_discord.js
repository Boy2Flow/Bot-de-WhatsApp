#!/usr/bin/env node

/**
 * Script de configuración rápida para Discord Rich Presence
 * Ejecuta: node setup_discord.js
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

console.log('\n╔═══════════════════════════════════════════╗');
console.log('║  🎮 CONFIGURACIÓN DISCORD RICH PRESENCE  ║');
console.log('╚═══════════════════════════════════════════╝\n');

console.log('📋 Pasos previos:');
console.log('1. Ve a https://discord.com/developers/applications');
console.log('2. Crea una nueva aplicación');
console.log('3. Copia el Application ID (Client ID)');
console.log('4. En "Rich Presence" > "Art Assets", sube las imágenes:');
console.log('   - bot_logo (logo principal)');
console.log('   - whatsapp_icon (icono pequeño)\n');

async function setup() {
    try {
        // Solicitar Client ID
        const clientId = await question('🔑 Ingresa tu Discord Application ID: ');
        
        if (!clientId || clientId.length < 10) {
            console.log('\n❌ Client ID inválido. Debe tener al menos 10 caracteres.');
            rl.close();
            return;
        }

        // Solicitar URLs opcionales
        console.log('\n📝 URLs para los botones (opcional, presiona Enter para omitir):');
        const githubUrl = await question('📱 URL de GitHub: ') || 'https://github.com';
        const discordUrl = await question('💬 URL de Discord: ') || 'https://discord.gg';

        // Leer el archivo actual
        const filePath = path.join(process.cwd(), 'utils', 'discordPresence.js');
        let content = fs.readFileSync(filePath, 'utf8');

        // Reemplazar CLIENT_ID
        content = content.replace(
            /const CLIENT_ID = '[^']*';/,
            `const CLIENT_ID = '${clientId}';`
        );

        // Reemplazar URLs de GitHub
        content = content.replace(
            /{ label: '📱 GitHub', url: '[^']*' }/g,
            `{ label: '📱 GitHub', url: '${githubUrl}' }`
        );

        content = content.replace(
            /{ label: '📱 Ver en GitHub', url: '[^']*' }/g,
            `{ label: '📱 Ver en GitHub', url: '${githubUrl}' }`
        );

        // Reemplazar URLs de Discord
        content = content.replace(
            /{ label: '💬 Soporte', url: '[^']*' }/g,
            `{ label: '💬 Soporte', url: '${discordUrl}' }`
        );

        content = content.replace(
            /{ label: '💬 Discord', url: '[^']*' }/g,
            `{ label: '💬 Discord', url: '${discordUrl}' }`
        );

        // Guardar cambios
        fs.writeFileSync(filePath, content, 'utf8');

        console.log('\n✅ Configuración guardada exitosamente!');
        console.log('\n📋 Resumen:');
        console.log(`   Client ID: ${clientId}`);
        console.log(`   GitHub URL: ${githubUrl}`);
        console.log(`   Discord URL: ${discordUrl}`);
        
        console.log('\n🚀 Próximos pasos:');
        console.log('1. Asegúrate de que Discord esté abierto');
        console.log('2. Sube las imágenes al Developer Portal');
        console.log('3. Reinicia el bot: node index.js');
        console.log('\n💡 Las imágenes generadas están en la carpeta del proyecto');
        console.log('   Súbelas con estos nombres:');
        console.log('   - bot_logo');
        console.log('   - whatsapp_icon\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

setup();
