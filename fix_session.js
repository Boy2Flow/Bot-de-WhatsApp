import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 LIMPIADOR DE SESIÓN DE WHATSAPP\n');
console.log('Este script resolverá el error "Connection Terminated"\n');

const authPath = path.join(__dirname, 'auth_info');
const backupPath = path.join(__dirname, 'auth_backups');

// Crear carpeta de backups si no existe
if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath);
}

// Función para copiar directorio recursivamente
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Función para eliminar directorio recursivamente
function removeDir(dir) {
    if (fs.existsSync(dir)) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (let entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                removeDir(fullPath);
            } else {
                fs.unlinkSync(fullPath);
            }
        }
        
        fs.rmdirSync(dir);
    }
}

try {
    // Verificar si existe la sesión
    if (fs.existsSync(authPath)) {
        console.log('📦 Creando backup de la sesión actual...');
        const timestamp = Date.now();
        const backupDir = path.join(backupPath, `auth_backup_${timestamp}`);
        
        copyDir(authPath, backupDir);
        console.log(`✅ Backup creado: auth_backups/auth_backup_${timestamp}\n`);
        
        console.log('🗑️  Eliminando sesión corrupta...');
        removeDir(authPath);
        console.log('✅ Sesión eliminada\n');
    } else {
        console.log('ℹ️  No hay sesión existente\n');
    }
    
    // Eliminar archivo QR antiguo
    const qrPath = path.join(__dirname, 'whatsapp_qr.png');
    if (fs.existsSync(qrPath)) {
        fs.unlinkSync(qrPath);
        console.log('🗑️  Código QR antiguo eliminado\n');
    }
    
    console.log('✅ LIMPIEZA COMPLETADA\n');
    console.log('📱 PASOS SIGUIENTES:');
    console.log('   1. CIERRA todas las sesiones de WhatsApp Web en tu navegador');
    console.log('   2. En tu teléfono: WhatsApp > Configuración > Dispositivos vinculados');
    console.log('   3. Cierra TODAS las sesiones activas');
    console.log('   4. Ejecuta: node index.js');
    console.log('   5. Escanea el nuevo código QR\n');
    console.log('⚠️  IMPORTANTE: Si el error persiste, es porque tienes WhatsApp Web');
    console.log('   abierto en otro lugar. Cierra TODAS las pestañas de WhatsApp Web.\n');
    
} catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
    process.exit(1);
}
