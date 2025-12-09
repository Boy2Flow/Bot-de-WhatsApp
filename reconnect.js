import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

console.log('🔄 Iniciando proceso de reconexión...\n');

const authDir = path.join(process.cwd(), 'auth_info');
const qrFile = path.join(process.cwd(), 'whatsapp_qr.png');

// Paso 1: Limpiar QR antiguo
if (fs.existsSync(qrFile)) {
    fs.unlinkSync(qrFile);
    console.log('✅ QR antiguo eliminado');
}

// Paso 2: Hacer backup y limpiar sesión
if (fs.existsSync(authDir)) {
    const backupDir = path.join(process.cwd(), `auth_backup_${Date.now()}`);
    console.log('💾 Creando backup de sesión...');
    fs.cpSync(authDir, backupDir, { recursive: true });
    
    console.log('🗑️  Eliminando sesión actual...');
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log('✅ Sesión limpiada');
}

console.log('\n📱 INSTRUCCIONES IMPORTANTES:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Abre WhatsApp en tu teléfono');
console.log('2. Ve a: Configuración > Dispositivos vinculados');
console.log('3. CIERRA TODAS las sesiones activas');
console.log('4. Espera 5 segundos');
console.log('5. Presiona ENTER para continuar...\n');

// Esperar confirmación del usuario
process.stdin.once('data', () => {
    console.log('\n🚀 Iniciando bot...\n');
    
    // Iniciar el bot
    const botProcess = exec('node index.js', (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
    });
    
    // Mostrar output del bot
    botProcess.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    
    botProcess.stderr.on('data', (data) => {
        process.stderr.write(data);
    });
    
    // Mantener el proceso vivo
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Deteniendo bot...');
        botProcess.kill();
        process.exit(0);
    });
});
