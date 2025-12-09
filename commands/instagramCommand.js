import fs from 'fs';
import path from 'path';

const IG_FILE = path.join(process.cwd(), 'instagram_data.json');

// Cargar datos
const loadData = () => {
    if (!fs.existsSync(IG_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(IG_FILE, 'utf8'));
    } catch (e) {
        return {};
    }
};

// Guardar datos
const saveData = (data) => {
    fs.writeFileSync(IG_FILE, JSON.stringify(data, null, 2));
};

// Verificar si es administrador
const isAdmin = async (sock, from, userId) => {
    try {
        const groupMetadata = await sock.groupMetadata(from);
        const participant = groupMetadata.participants.find(p => p.id === userId);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch (e) {
        return false;
    }
};

export const addIgCommand = {
    name: 'addig',
    description: 'Añade el Instagram de un usuario (Solo Admins)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        if (!from.endsWith('@g.us')) {
            await sock.sendMessage(from, { text: '❌ Este comando solo funciona en grupos.' }, { quoted: message });
            return;
        }

        const isUserAdmin = await isAdmin(sock, from, senderId);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '⛔ Solo los administradores pueden usar este comando.' }, { quoted: message });
            return;
        }

        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        let targetUser = senderId;
        let igUser = '';

        if (mentionedJid && mentionedJid.length > 0) {
            // Caso: Añadir a otro (.addig @user instagram)
            targetUser = mentionedJid[0];
            igUser = args.filter(arg => !arg.includes('@')).join(' ').trim();
        } else {
            // Caso: Añadirme a mí mismo (.addig instagram)
            igUser = args.join(' ').trim();
        }

        if (!igUser) {
            await sock.sendMessage(from, { text: '❌ Debes escribir el usuario de Instagram.\nUso: .addig [instagram] o .addig @usuario [instagram]' }, { quoted: message });
            return;
        }

        const data = loadData();
        if (!data[from]) data[from] = {};

        // Limpiar el usuario de IG (quitar @ inicial si lo puso)
        const cleanIg = igUser.startsWith('@') ? igUser.slice(1) : igUser;
        const igLink = `https://www.instagram.com/${cleanIg}`;

        data[from][targetUser] = {
            username: cleanIg,
            link: igLink,
            addedBy: senderId
        };

        saveData(data);

        await sock.sendMessage(from, {
            text: `✅ *INSTAGRAM AÑADIDO*\n\n👤 Usuario: @${targetUser.split('@')[0]}\nIG: ${cleanIg}\n🔗 Link: ${igLink}`,
            mentions: [targetUser]
        }, { quoted: message });
    }
};

export const igCommand = {
    name: 'ig',
    description: 'Muestra el Instagram de usuarios (Solo Admins)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        if (!from.endsWith('@g.us')) {
            await sock.sendMessage(from, { text: '❌ Este comando solo funciona en grupos.' }, { quoted: message });
            return;
        }

        const isUserAdmin = await isAdmin(sock, from, senderId);
        if (!isUserAdmin) {
            await sock.sendMessage(from, { text: '⛔ Solo los administradores pueden usar este comando.' }, { quoted: message });
            return;
        }

        const data = loadData();
        if (!data[from] || Object.keys(data[from]).length === 0) {
            await sock.sendMessage(from, { text: '📭 No hay Instagrams registrados en este grupo.' }, { quoted: message });
            return;
        }

        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        // Caso 1: Buscar usuario específico
        if (mentionedJid && mentionedJid.length > 0) {
            const targetUser = mentionedJid[0];
            const userData = data[from][targetUser];

            if (userData) {
                await sock.sendMessage(from, {
                    text: `*INSTAGRAM DE USUARIO*\n\n👤 Usuario: @${targetUser.split('@')[0]}\nIG: ${userData.username}\n🔗 Link: ${userData.link}`,
                    mentions: [targetUser]
                }, { quoted: message });
            } else {
                await sock.sendMessage(from, { text: `❌ El usuario @${targetUser.split('@')[0]} no tiene su Instagram registrado.`, mentions: [targetUser] }, { quoted: message });
            }
            return;
        }

        // Caso 2: Listar todos
        let text = '*LISTA DE INSTAGRAMS*\n\n';
        const mentions = [];

        for (const [userId, info] of Object.entries(data[from])) {
            text += `👤 @${userId.split('@')[0]}\nIG: ${info.username}\n🔗 ${info.link}\n\n`;
            mentions.push(userId);
        }

        await sock.sendMessage(from, { text, mentions }, { quoted: message });
    }
};

export const delIgCommand = {
    name: 'delig',
    description: 'Elimina el Instagram de un usuario (Solo Admins)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        if (!from.endsWith('@g.us')) return;

        const isUserAdmin = await isAdmin(sock, from, senderId);
        if (!isUserAdmin) return;

        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, { text: '❌ Menciona al usuario para borrar su Instagram.' }, { quoted: message });
            return;
        }

        const targetUser = mentionedJid[0];
        const data = loadData();

        if (data[from] && data[from][targetUser]) {
            delete data[from][targetUser];
            saveData(data);
            await sock.sendMessage(from, { text: `🗑️ Instagram de @${targetUser.split('@')[0]} eliminado.`, mentions: [targetUser] }, { quoted: message });
        } else {
            await sock.sendMessage(from, { text: '❌ Ese usuario no tiene Instagram registrado.' }, { quoted: message });
        }
    }
};
