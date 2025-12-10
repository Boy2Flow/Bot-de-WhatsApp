import fs from 'fs';
import path from 'path';
import { getAudioUrl } from 'google-tts-api';
import axios from 'axios';

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
                    // SI ES UNA ALARMA (Tipo 'alarm')
                    if (reminder.type === 'alarm') {
                        const msgText = `🚨 *¡ALARMA! ¡ALARMA!* 🚨\n\n📌 *"${reminder.message}"*\n📅 ${reminder.timeStr}`;
                        await sock.sendMessage(reminder.userId, { text: msgText });

                        // Generar y enviar audio
                        try {
                            const alarmText = `Alarma, alarma. Es hora de ${reminder.message}. Alarma, alarma.`;
                            const url = getAudioUrl(alarmText, {
                                lang: 'es',
                                slow: false,
                                host: 'https://translate.google.com',
                            });

                            const response = await axios.get(url, { responseType: 'arraybuffer' });
                            const buffer = Buffer.from(response.data);

                            await sock.sendMessage(reminder.userId, {
                                audio: buffer,
                                mimetype: 'audio/mpeg',
                                ptt: true // Nota de voz para que "suene" más directo
                            });

                            // Enviar una segunda vez para insistir
                            await sock.sendMessage(reminder.userId, {
                                audio: buffer,
                                mimetype: 'audio/mpeg',
                                ptt: true
                            });

                        } catch (err) {
                            console.error('Error generando audio de alarma:', err);
                        }

                    } else {
                        // RECORDATORIO NORMAL
                        const msgText = `⏰ *¡ES HORA!*\n\nRecordatorio programado:\n\n📌 *"${reminder.message}"*\n\n📅 Fecha: ${reminder.dateStr} ${reminder.timeStr}`;
                        await sock.sendMessage(reminder.userId, { text: msgText });
                    }

                    console.log(`✅ Recordatorio/Alarma enviado a ${reminder.userId}`);
                    changed = true;
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

export const alarmaCommand = {
    name: 'alarma',
    aliases: ['alarm', 'despertador'],
    description: 'Programa una alarma que enviará notas de voz. Uso: .alarma HH:MM [Mensaje]',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || from;

        // Validar argumentos
        // Formatos aceptados:
        // 1. .alarma HH:MM (asume hoy o mañana)
        // 2. .alarma HH:MM Mensaje
        // 3. .alarma DD/MM/AAAA HH:MM Mensaje

        if (args.length < 1) {
            await sock.sendMessage(from, {
                text: '❌ Formato incorrecto.\n\nUso simple: *.alarma HORA:MINUTO [Mensaje]*\nEjemplo: .alarma 07:00 Despertar'
            }, { quoted: message });
            return;
        }

        let dateStr, timeStr, msg;
        const now = new Date();

        // Caso simple: Solo hora (o hora + mensaje)
        // Intentamos detectar si el primer arg es una hora (contiene :)
        if (args[0].includes(':') && !args[0].includes('/')) {
            timeStr = args[0];
            msg = args.slice(1).join(' ') || 'Alarma';

            // Determinar fecha (hoy o mañana)
            const [h, m] = timeStr.split(':').map(Number);
            const targetTime = new Date();
            targetTime.setHours(h, m, 0, 0);

            if (targetTime < now) {
                // Si la hora ya pasó hoy, es para mañana
                targetTime.setDate(targetTime.getDate() + 1);
            }

            dateStr = `${targetTime.getDate()}/${targetTime.getMonth() + 1}/${targetTime.getFullYear()}`;
        }
        // Caso completo: Fecha y hora
        else if (args[0].includes('/') && args[1].includes(':')) {
            dateStr = args[0];
            timeStr = args[1];
            msg = args.slice(2).join(' ') || 'Alarma';
        } else {
            await sock.sendMessage(from, {
                text: '❌ Formato de hora inválido. Usa HH:MM (ej: 14:30)'
            }, { quoted: message });
            return;
        }

        const targetDate = parseDate(dateStr, timeStr);

        if (!targetDate) {
            await sock.sendMessage(from, { text: '❌ Fecha u hora inválida.' }, { quoted: message });
            return;
        }

        if (targetDate <= now) {
            await sock.sendMessage(from, { text: '❌ La fecha/hora debe ser futura.' }, { quoted: message });
            return;
        }

        const reminders = loadReminders();

        reminders.push({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            userId: userId,
            timestamp: targetDate.getTime(),
            dateStr,
            timeStr,
            message: msg,
            remindedDayBefore: true, // Las alarmas no necesitan aviso de 24h
            type: 'alarm' // Marcamos como alarma
        });

        saveReminders(reminders);

        // Calcular tiempo restante
        const diffValid = targetDate - now;
        const hours = Math.floor(diffValid / (1000 * 60 * 60));
        const minutes = Math.floor((diffValid % (1000 * 60 * 60)) / (1000 * 60));

        await sock.sendMessage(from, {
            text: `🚨 *ALARMA CONFIGURADA*\n\n📅 Fecha: ${dateStr}\n⏰ Hora: ${timeStr}\n📝 Mensaje: ${msg}\n\n🔔 Sonará en: ${hours}h ${minutes}m\n(Te enviaré notas de voz cuando sea la hora)`
        }, { quoted: message });

        initReminderSystem(sock);
    }
};
