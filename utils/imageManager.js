import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas de las carpetas de imágenes
const IMAGES_DIR = path.join(__dirname, '..', 'imagenes_bot');
const TROLL_DIR = path.join(__dirname, '..', 'Fotos_troll');

/**
 * Obtiene una imagen aleatoria de la carpeta Fotos_troll
 */
export function getRandomTrollImage() {
    try {
        if (!fs.existsSync(TROLL_DIR)) return null;
        
        const files = fs.readdirSync(TROLL_DIR).filter(file => 
            file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
        );
        
        if (files.length === 0) return null;
        
        const randomFile = files[Math.floor(Math.random() * files.length)];
        return path.join(TROLL_DIR, randomFile);
    } catch (error) {
        return null;
    }
}

/**
 * Obtiene la imagen de bienvenida
 */
export function getWelcomeImage() {
    const welcomePath = path.join(IMAGES_DIR, 'bienvenida.png');
    if (fs.existsSync(welcomePath)) {
        return welcomePath;
    }
    // Si no existe, usar una imagen troll aleatoria
    return getRandomTrollImage();
}

/**
 * Obtiene la imagen del menú
 */
export function getMenuImage() {
    const menuPath = path.join(IMAGES_DIR, 'menu.png');
    if (fs.existsSync(menuPath)) {
        return menuPath;
    }
    return null;
}

/**
 * Obtiene la imagen del panel de admin
 */
export function getAdminImage() {
    const adminPath = path.join(IMAGES_DIR, 'admin.png');
    if (fs.existsSync(adminPath)) {
        return adminPath;
    }
    return null;
}

/**
 * Obtiene la imagen de economía
 */
export function getEconomyImage() {
    const economyPath = path.join(IMAGES_DIR, 'economia.png');
    if (fs.existsSync(economyPath)) {
        return economyPath;
    }
    return null;
}

/**
 * Obtiene la imagen de juegos
 */
export function getGamesImage() {
    const gamesPath = path.join(IMAGES_DIR, 'juegos.png');
    if (fs.existsSync(gamesPath)) {
        return gamesPath;
    }
    return null;
}

/**
 * Obtiene la imagen de amor/romance
 */
export function getLoveImage() {
    const lovePath = path.join(IMAGES_DIR, 'amor.png');
    if (fs.existsSync(lovePath)) {
        return lovePath;
    }
    return null;
}

/**
 * Obtiene la imagen de RPG
 */
export function getRPGImage() {
    const rpgPath = path.join(IMAGES_DIR, 'rpg.png');
    if (fs.existsSync(rpgPath)) {
        return rpgPath;
    }
    return null;
}

/**
 * Obtiene la imagen de interacciones (menú)
 */
export function getInteractionsImage() {
    const interactionsPath = path.join(IMAGES_DIR, 'interacciones.png');
    if (fs.existsSync(interactionsPath)) {
        return interactionsPath;
    }
    return getRandomTrollImage();
}

export function getInteractionImage(type) {
    try {
        // Ruta de la carpeta de interacciones
        const interactionDir = path.join(__dirname, '..', 'interactions', type);
        
        console.log(`🔍 Buscando media en: ${interactionDir}`);
        
        // Verificar si existe la carpeta
        if (!fs.existsSync(interactionDir)) {
            console.log(`⚠️ Carpeta no existe: ${type}`);
            return getRandomTrollImage();
        }
        
        // Obtener todos los archivos de la carpeta
        const allFiles = fs.readdirSync(interactionDir).filter(file => {
            const ext = file.toLowerCase();
            return ext.endsWith('.gif') || 
                   ext.endsWith('.mp4') || 
                   ext.endsWith('.jpg') || 
                   ext.endsWith('.jpeg') || 
                   ext.endsWith('.png') || 
                   ext.endsWith('.webp');
        });
        
        console.log(`📁 Archivos encontrados en ${type}:`, allFiles);
        
        // Si no hay archivos, usar imagen aleatoria
        if (allFiles.length === 0) {
            console.log(`⚠️ No hay archivos en carpeta ${type}, usando Fotos_troll`);
            return getRandomTrollImage();
        }
        
        // PRIORIZAR MP4 sobre GIF (MP4 funciona mejor en WhatsApp)
        const mp4Files = allFiles.filter(f => f.toLowerCase().endsWith('.mp4'));
        const gifFiles = allFiles.filter(f => f.toLowerCase().endsWith('.gif'));
        const imageFiles = allFiles.filter(f => {
            const ext = f.toLowerCase();
            return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
                   ext.endsWith('.png') || ext.endsWith('.webp');
        });
        
        let selectedFile;
        
        if (mp4Files.length > 0) {
            // Preferir MP4
            selectedFile = mp4Files[Math.floor(Math.random() * mp4Files.length)];
            console.log(`✅ Usando MP4 (prioridad): ${selectedFile}`);
        } else if (gifFiles.length > 0) {
            // Si no hay MP4, usar GIF
            selectedFile = gifFiles[Math.floor(Math.random() * gifFiles.length)];
            console.log(`⚠️ Usando GIF (puede no funcionar): ${selectedFile}`);
        } else if (imageFiles.length > 0) {
            // Si no hay ni MP4 ni GIF, usar imagen
            selectedFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
            console.log(`📷 Usando imagen estática: ${selectedFile}`);
        } else {
            // Fallback a cualquier archivo
            selectedFile = allFiles[Math.floor(Math.random() * allFiles.length)];
            console.log(`🎲 Usando archivo aleatorio: ${selectedFile}`);
        }
        
        const selectedPath = path.join(interactionDir, selectedFile);
        
        return selectedPath;
        
    } catch (error) {
        console.error('❌ Error obteniendo imagen de interacción:', error);
        return getRandomTrollImage();
    }
}





/**
 * Envía un mensaje con imagen, GIF o video
 * @param {object} sock - Socket de WhatsApp
 * @param {string} chatId - ID del chat
 * @param {string} text - Texto del mensaje
 * @param {string} mediaPath - Ruta de la imagen/GIF/video
 * @param {array} mentions - Array de menciones
 */
export async function sendMessageWithImage(sock, chatId, text, mediaPath, mentions = []) {
    try {
        if (!mediaPath || !fs.existsSync(mediaPath)) {
            console.log('⚠️ No hay media o no existe:', mediaPath);
            // Si no hay media, enviar solo texto
            return await sock.sendMessage(chatId, {
                text: text,
                mentions: mentions
            });
        }

        // Leer el archivo
        const mediaBuffer = fs.readFileSync(mediaPath);
        const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);
        const fileSizeBytes = mediaBuffer.length;
        
        console.log(`📎 Enviando media: ${path.basename(mediaPath)} (${fileSizeMB} MB)`);
        
        // Advertencia si el archivo es muy grande (pero intentar enviarlo de todas formas)
        if (fileSizeBytes > 16 * 1024 * 1024) {
            console.log(`⚠️ ADVERTENCIA: Archivo muy grande (${fileSizeMB} MB). Límite WhatsApp: 16 MB`);
            console.log('🔄 Intentando enviar de todas formas...');
        } else if (fileSizeBytes > 10 * 1024 * 1024) {
            console.log(`⚠️ Archivo grande (${fileSizeMB} MB). Puede tardar en enviarse...`);
        }
        
        // Detectar el tipo de archivo por extensión
        const ext = mediaPath.toLowerCase();
        
        if (ext.endsWith('.mp4') || ext.endsWith('.avi') || ext.endsWith('.mov')) {
            // Es un video
            console.log('🎬 Enviando como video...');
            return await sock.sendMessage(chatId, {
                video: mediaBuffer,
                caption: text,
                mentions: mentions,
                gifPlayback: true
            });
        } else if (ext.endsWith('.gif')) {
            // Es un GIF - enviarlo como video con gifPlayback
            console.log('🎞️ Enviando GIF...');
            
            // Enviar el GIF directamente
            return await sock.sendMessage(chatId, {
                video: mediaBuffer,
                caption: text,
                mentions: mentions,
                gifPlayback: true,
                mimetype: 'video/mp4' // Importante: especificar mimetype
            });
        } else {
            // Es una imagen estática (PNG, JPG, WEBP)
            console.log('🖼️ Enviando como imagen...');
            return await sock.sendMessage(chatId, {
                image: mediaBuffer,
                caption: text,
                mentions: mentions
            });
        }

    } catch (error) {
        console.error('❌ Error enviando mensaje con media:', error.message);
        console.error('Ruta del archivo:', mediaPath);
        console.error('Detalles del error:', error);
        
        // Fallback: enviar solo texto con nota del error
        return await sock.sendMessage(chatId, {
            text: text + '\n\n⚠️ (No se pudo enviar la imagen/GIF)',
            mentions: mentions
        });
    }
}



