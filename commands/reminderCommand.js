import fs from 'fs';
import path from 'path';

const REMINDERS_FILE = path.join(process.cwd(), 'reminders.json');

// Cargar recordatorios
const loadReminders = () => {
    if (!fs.existsSync(REMINDERS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
};

// Guardar recordatorios
const saveReminders = (data) => {
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(data, null, 2));
};

// Función para parsear fecha DD/MM/YYYY HH:MM
const parseDate = (dateStr, timeStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    if (!day || !month || !year || hours === undefined || minutes === undefined) return null;

    const date = new Date(year, month - 1, day, hours, minutes);

    // Validar si la fecha es válida
    if (isNaN(date.getTime())) return null;

    return date;
};

// Sistema de chequeo automático
let isChecking = false;

export const initReminderSystem = (sock) => {
    if (isChecking) return;
    isChecking = true;

    console.log('⏰ Sistema de recordatorios iniciado...');

    setInterval(async () => {
        const reminders = loadReminders();
        if (reminders.length === 0) return;

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const remainingReminders = [];
        let changed = false;

        for (const reminder of reminders) {
            // Chequeo de aviso previo (24 horas antes)
            if (!reminder.remindedDayBefore && now >= (reminder.timestamp - oneDay)) {
                try {
                    const msgText = `🔔 *RECORDATORIO: MAÑANA*\n\nHola, te recuerdo que mañana es la fecha para:\n\n📌 *"${reminder.message}"*\n\n📅 Fecha: ${reminder.dateStr} ${reminder.timeStr}`;

                    await sock.sendMessage(reminder.userId, { text: msgText });
                    console.log(`✅ Pre-recordatorio enviado a ${reminder.userId}`);

                    reminder.remindedDayBefore = true;
                    changed = true;
                } catch (error) {
                    console.error('❌ Error enviando pre-recordatorio:', error);
                }
            }

            // Chequeo de hora exacta
            if (now >= reminder.timestamp) {
                try {
                    const msgText = `⏰ *¡ES HORA!*\n\nRecordatorio programado:\n\n📌 *"${reminder.message}"*\n\n📅 Fecha: ${reminder.dateStr} ${reminder.timeStr}`;

                    await sock.sendMessage(reminder.userId, { text: msgText });
                    console.log(`✅ Recordatorio final enviado a ${reminder.userId}`);
                    changed = true; // Se eliminará porque no lo pusimos en remainingReminders
                } catch (error) {
                    console.error('❌ Error enviando recordatorio final:', error);
                    // Si falla, podrías decidir guardarlo, pero por ahora asumimos enviado/descartado para evitar spam
                    changed = true;
                }
            } else {
                // Si aún no es la hora, lo mantenemos
                remainingReminders.push(reminder);
            }
        }

        if (changed) {
            saveReminders(remainingReminders);
        }

    }, 30000); // Chequear cada 30 segundos
};

export const reminderCommand = {
    name: 'recordar',
    aliases: ['remind', 'recordatorio'],
    description: 'Programa un recordatorio. Uso: .recordar DD/MM/AAAA HH:MM Mensaje',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || from; // ID del usuario para enviar al privado

        if (args.length < 3) {
            await sock.sendMessage(from, {
                text: '❌ Formato incorrecto.\n\nUso: *.recordar DIA/MES/AÑO HORA:MINUTO Mensaje*\n\nEjemplo:\n.recordar 25/12/2025 00:00 Navidad\n.recordar 10/12/2025 14:30 Cita médico'
            }, { quoted: message });
            return;
        }

        const dateStr = args[0];
        const timeStr = args[1];
        const msg = args.slice(2).join(' ');

        const targetDate = parseDate(dateStr, timeStr);

        if (!targetDate) {
            await sock.sendMessage(from, { text: '❌ Fecha u hora inválida. Asegúrate de usar DD/MM/AAAA y HH:MM (24h).' }, { quoted: message });
            return;
        }

        const now = new Date();
        if (targetDate <= now) {
            await sock.sendMessage(from, { text: '❌ No puedo recordar cosas del pasado. Pon una fecha futura.' }, { quoted: message });
            return;
        }

        const reminders = loadReminders();
        const oneDay = 24 * 60 * 60 * 1000;

        // Si falta menos de 24h, marcamos el aviso previo como "ya hecho" para que no salte inmediatamente
        const isLessThan24h = (targetDate.getTime() - now.getTime()) < oneDay;

        reminders.push({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            userId: userId, // JID exacto del usuario para enviarle MD
            timestamp: targetDate.getTime(),
            dateStr,
            timeStr,
            message: msg,
            remindedDayBefore: isLessThan24h // True si falta menos de un día
        });

        saveReminders(reminders);

        // Calcular tiempo restante
        const diffValid = targetDate - now;
        const days = Math.floor(diffValid / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffValid % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffValid % (1000 * 60 * 60)) / (1000 * 60));

        let timeText = '';
        if (days > 0) timeText += `${days}d `;
        if (hours > 0) timeText += `${hours}h `;
        timeText += `${minutes}m`;

        let extraInfo = isLessThan24h ? '' : '\n🔔 Te avisaré también 24h antes.';

        await sock.sendMessage(from, {
            text: `✅ *RECORDATORIO GUARDADO*\n\n📅 Fecha: ${dateStr}\n⏰ Hora: ${timeStr}\n📝 Nota: ${msg}\n\n⏳ Tiempo restante: ${timeText}${extraInfo}`
        }, { quoted: message });

        // Iniciar sistema si no está corriendo (aunque se inicia en index.js normalmente)
        initReminderSystem(sock);
    }
};

export const listRemindersCommand = {
    name: 'misrecordatorios',
    description: 'Ver tus recordatorios pendientes',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || from;

        const reminders = loadReminders();
        const userReminders = reminders.filter(r => r.userId === userId).sort((a, b) => a.timestamp - b.timestamp);

        if (userReminders.length === 0) {
            await sock.sendMessage(from, { text: '📭 No tienes recordatorios pendientes.' }, { quoted: message });
            return;
        }

        let text = '⏰ *TUS RECORDATORIOS PENDIENTES*\n\n';

        userReminders.forEach((r, i) => {
            text += `${i + 1}. 📅 ${r.dateStr} ${r.timeStr}\n   📝 ${r.message}\n\n`;
        });

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};

export const delReminderCommand = {
    name: 'delrecordatorio',
    aliases: ['delremind'],
    description: 'Borra un recordatorio. Uso: .delrecordatorio [número]',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || from;
        const index = parseInt(args[0]) - 1;

        if (isNaN(index)) {
            await sock.sendMessage(from, { text: '❌ Debes especificar el número del recordatorio (usa .misrecordatorios para verlos).' }, { quoted: message });
            return;
        }

        const reminders = loadReminders();
        const userReminders = reminders.filter(r => r.userId === userId).sort((a, b) => a.timestamp - b.timestamp);

        if (index < 0 || index >= userReminders.length) {
            await sock.sendMessage(from, { text: '❌ Número de recordatorio inválido.' }, { quoted: message });
            return;
        }

        const targetId = userReminders[index].id;
        const newReminders = reminders.filter(r => r.id !== targetId);

        saveReminders(newReminders);

        await sock.sendMessage(from, { text: '🗑️ Recordatorio eliminado.' }, { quoted: message });
    }
};
