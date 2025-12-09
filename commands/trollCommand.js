import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

export const trollCommand = {
    name: 'msg',
    aliases: ['troll', 'macarena'],
    description: 'Envía spam troll a un usuario (Solo Super Admins)',
    execute: async (sock, message, args) => {
        console.log('[TROLL] Comando .msg ejecutado');
        const from = message.key.remoteJid;
        // Obtener ID del remitente
        const senderJid = message.key.participant || message.key.remoteJid;
        
        console.log(`[TROLL] Intento de uso por: ${senderJid}`);

        // Verificar si es super admin
        if (!privilegedConfig.isSuperAdmin(senderJid)) {
            console.log('[TROLL] Acceso denegado: No es super admin');
            await sock.sendMessage(from, { text: '⛔ Este comando es exclusivo de usuarios privilegiados.' }, { quoted: message });
            return;
        }

        // Verificar mención
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, { text: '❌ Debes mencionar a alguien para trollear.' }, { quoted: message });
            return;
        }

        const targetUser = mentionedJid[0];
        console.log(`[TROLL] Objetivo: ${targetUser}`);
        
        // PROTECCIÓN: No se puede trollear a otro usuario privilegiado
        if (privilegedConfig.isSuperAdmin(targetUser)) {
            await sock.sendMessage(from, { 
                text: '🛡️ No puedes usar este comando contra otro usuario privilegiado.' 
            }, { quoted: message });
            return;
        }

        const photosDir = path.join(process.cwd(), 'Fotos_troll');

        // Borrar el mensaje del comando (sigilo)
        try {
            await sock.sendMessage(from, { delete: message.key });
        } catch (e) {
            console.log('[TROLL] No se pudo borrar el mensaje del comando');
        }

        // Mensaje temporal de inicio
        const initMsg = await sock.sendMessage(from, { text: '😈 Iniciando protocolo Macarena...' }, { quoted: message });
        
        // Borrar mensaje de inicio después de 2 segundos
        setTimeout(async () => {
            try {
                if (initMsg) await sock.sendMessage(from, { delete: initMsg.key });
            } catch (e) {}
        }, 2000);

        // Texto de la Macarena en hebreo
        const macarenaLyrics = `תן לגוף שלך שמחה, מקרנה
כי הגוף שלך נועד לתת שמחה ודברים טובים
תן לגוף שלך שמחה, מקרנה
היי מקרנה, איי
תן לגוף שלך שמחה, מקרנה
כי הגוף שלך נועד לתת שמחה ודברים טובים
תן לגוף שלך שמחה, מקרנה
היי מקרנה, איי
למקרנה יש חבר ששמו
שם משפחתו ויטורינו
ובטקס השבעת הדגל של הילד
היא עשתה את זה עם שתי חברות, איי
למקרנה יש חבר ששמו
שם משפחתו ויטורינו
ובטקס השבעת הדגל של הילד
היא עשתה את זה עם שתי חברות, איי
תן לגוף שלך שמחה, מקרנה
כי הגוף שלך נועד לתת שמחה ודברים טובים
תן לגוף שלך שמחה, מקרנה
היי מקרנה, איי
תן לגוף שלך שמחה, מקרנה
כי הגוף שלך נועד לתת שמחה ודברים טובים
תן לגוף שלך שמחה, מקרנה
היי מקרנה, הו
מקרנה, מקרנה, מקארנה
את אוהבת את הקיץ במרבלה
מקארנה, מקארנה, מקארנה
את אוהבת את תנועת הגרילה, הו
הו
תן לגוף שלך שמחה, מקארנה
כי גופך נועד לקבל שמחה ודברים טובים
תן לגוף שלך שמחה, מקארנה
היי מקארנה, הו
תן לגוף שלך שמחה, מקארנה
כי גופך נועד לקבל שמחה ודברים טובים
תן לגוף שלך שמחה, מקארנה
היי מקארנה, הו
מקארנה חולמת על אל קורטה אינגלס`;

        await sock.sendMessage(from, { text: '😈 Iniciando protocolo Macarena...' }, { quoted: message });

        try {
            // Enviar fotos si existen
            if (fs.existsSync(photosDir)) {
                const files = fs.readdirSync(photosDir);
                const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

                if (imageFiles.length > 0) {
                    for (const file of imageFiles) {
                        const imagePath = path.join(photosDir, file);
                        await sock.sendMessage(targetUser, { 
                            image: fs.readFileSync(imagePath),
                            caption: '🤡'
                        });
                        // Pequeña pausa para no saturar
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            // Enviar letra
            await sock.sendMessage(targetUser, { text: macarenaLyrics });

            const doneMsg = await sock.sendMessage(from, { text: '✅ Ataque troll completado.' });
            
            // Borrar mensaje de confirmación
            setTimeout(async () => {
                try {
                    if (doneMsg) await sock.sendMessage(from, { delete: doneMsg.key });
                } catch (e) {}
            }, 3000);

        } catch (error) {
            console.error('Error en comando troll:', error);
            // No enviamos error al grupo para mantener el sigilo, solo log
        }
    }
};
