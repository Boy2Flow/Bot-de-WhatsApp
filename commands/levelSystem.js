export const LEVELS = [
    { count: 100, title: 'Mudo de Mierda' },
    { count: 250, title: 'Tímido del Grupo' },
    { count: 500, title: 'Iniciado Pajero' },
    { count: 1000, title: 'Hablador Compulsivo' },
    { count: 1500, title: 'Teclado en Llamas' },
    { count: 2000, title: 'No Calla Ni Debajo del Agua' },
    { count: 2500, title: 'Loro Sin Vida' },
    { count: 3000, title: 'Dedos Rápidos' },
    { count: 3500, title: 'Soplapollas Oficial' },
    { count: 4000, title: 'Fantasma del Chat' },
    { count: 4500, title: 'Pesado de Cojones' },
    { count: 5000, title: 'Adicto al WhatsApp' },
    { count: 5500, title: 'No Tienes Amigos' },
    { count: 6000, title: 'Vivir es Opcional' },
    { count: 6500, title: 'Teclado Carbonizado' },
    { count: 7000, title: 'Alma Perdida en el Chat' },
    { count: 7500, title: 'Veterano del Texto' },
    { count: 8000, title: 'Ciborg del Chisme' },
    { count: 8500, title: 'Máquina de Escribir' },
    { count: 9000, title: 'Terrorista del Chat' },
    { count: 9500, title: 'Rey del Copy-Paste' },
    { count: 10000, title: 'Dios del Spam' },
    { count: 10500, title: 'Profeta del Shitpost' },
    { count: 11000, title: 'Guerrero del Teclado' },
    { count: 11500, title: 'Manos de Rayo' },
    { count: 12000, title: 'Sin Oficio ni Beneficio' },
    { count: 12500, title: 'Señor de los Mensajes' },
    { count: 13000, title: 'Maestro del Texto' },
    { count: 13500, title: 'Obsesivo Compulsivo' },
    { count: 14000, title: 'Leyenda Urbana' },
    { count: 14500, title: 'Mito de Internet' },
    { count: 15000, title: 'Influencer de Barrio' },
    { count: 15500, title: 'Celebridad de Whatsapp' },
    { count: 16000, title: 'Ídolo de Masas' },
    { count: 16500, title: 'Gurú del Spam' },
    { count: 17000, title: 'Avatar del Chat' },
    { count: 17500, title: 'Titán del Texto' },
    { count: 18000, title: 'Coloso de la Escritura' },
    { count: 18500, title: 'Emperador del Teclado' },
    { count: 19000, title: 'Faraón del Spam' },
    { count: 19500, title: 'Deidad Menor' },
    { count: 20000, title: 'Señor de los Emojis' },
    { count: 25000, title: 'No Toca Pasto' },
    { count: 30000, title: 'Eremita Digital' },
    { count: 35000, title: 'Fusión con el Móvil' },
    { count: 40000, title: 'Matrix Viviente' },
    { count: 45000, title: 'Hijo de Zuckerberg' },
    { count: 50000, title: 'Virgen Supremo' },
    { count: 75000, title: 'Bot Humano' },
    { count: 100000, title: 'Leyenda sin Vida Social' }
];

export async function checkLevelUp(sock, from, userId, newCount) {
    const leveleached = LEVELS.find(l => l.count === newCount);

    if (leveleached) {
        const userMention = userId.split('@')[0];
        const text = `🎉 *¡SUBIDA DE NIVEL!* 🎉\n\nFelicidades @${userMention}, has enviado ${newCount} mensajes.\n\n💩 Nuevo Título: *${leveleached.title}*\n\n_Sigue perdiendo el tiempo aquí..._`;

        await sock.sendMessage(from, {
            text: text,
            mentions: [userId]
        });
    }
}

import fs from 'fs';
import path from 'path';

// Helper para leer mensajes (reutilizando la lógica de messageHandler pero en lectura)
function getMessageData(groupId) {
    const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');
    if (!fs.existsSync(MESSAGES_FILE)) return {};
    try {
        const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
        return data[groupId] || {};
    } catch (e) {
        return {};
    }
}

export const rankCommand = {
    name: 'nivel',
    aliases: ['rank', 'level', 'lvl'],
    description: 'Ver tu nivel de mensajes y título',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        const groupData = getMessageData(from);
        const count = groupData[userId] || 0;

        // Encontrar título actual (el más alto alcanzado)
        let currentTitle = 'Fantasía Nula';
        // Ordenamos niveles descendente para encontrar el primero que cumple count >= level.count
        const sortedLevels = [...LEVELS].sort((a, b) => b.count - a.count);
        const currentLevelObj = sortedLevels.find(l => count >= l.count);
        if (currentLevelObj) currentTitle = currentLevelObj.title;

        // Encontrar siguiente nivel
        // Ordenamos ascendente
        const nextLevelObj = LEVELS.sort((a, b) => a.count - b.count).find(l => l.count > count);

        let text = `📊 *TU NIVEL DE ADICCIÓN* 📊\n\n`;
        text += `👤 *Usuario:* @${userId.split('@')[0]}\n`;
        text += `📨 *Mensajes:* ${count}\n`;
        text += `🏷️ *Título:* ${currentTitle}\n`;

        if (nextLevelObj) {
            const remaining = nextLevelObj.count - count;
            text += `\n🔜 *Siguiente Nivel:* ${nextLevelObj.title} (${nextLevelObj.count})\n`;
            text += `📉 Te faltan *${remaining}* mensajes para dejar de ser quien eres.`;
        } else {
            text += `\n👑 *¡Has alcanzado el nivel máximo!* Toca pasto, por favor.`;
        }

        await sock.sendMessage(from, { text, mentions: [userId] }, { quoted: message });
    }
};

export const topMessagesCommand = {
    name: 'topmensajes',
    aliases: ['topmsg', 'ranking', 'spammers'],
    description: 'Top 10 usuarios con más mensajes',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;

        const groupData = getMessageData(from);
        if (Object.keys(groupData).length === 0) {
            await sock.sendMessage(from, { text: '❌ No hay registros de mensajes en este grupo aún.' }, { quoted: message });
            return;
        }

        // Convertir a array y ordenar
        const sortedUsers = Object.entries(groupData)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        let text = `🏆 *TOP 10 SPAMMERS* 🏆\n_Quienes no tienen vida social_\n\n`;

        sortedUsers.forEach((user, index) => {
            const [id, count] = user;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            // Intentar obtener título
            let title = '';
            const lvl = [...LEVELS].sort((a, b) => b.count - a.count).find(l => count >= l.count);
            if (lvl) title = ` - _${lvl.title}_`;

            text += `${medal} @${id.split('@')[0]} : *${count}* msgs${title}\n`;
        });

        const mentions = sortedUsers.map(u => u[0]);
        await sock.sendMessage(from, { text, mentions }, { quoted: message });
    }
};
