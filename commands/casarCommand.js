import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

// Archivo para almacenar los matrimonios
const MARRIAGES_FILE = path.join(process.cwd(), 'marriages.json');

// Archivo para almacenar el historial de divorcios
const DIVORCES_FILE = path.join(process.cwd(), 'divorces.json');

// Inicializar archivos si no existen
if (!fs.existsSync(MARRIAGES_FILE)) {
    fs.writeFileSync(MARRIAGES_FILE, JSON.stringify({}));
}

if (!fs.existsSync(DIVORCES_FILE)) {
    fs.writeFileSync(DIVORCES_FILE, JSON.stringify({}));
}

// Cargar matrimonios
function loadMarriages() {
    try {
        const data = fs.readFileSync(MARRIAGES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar matrimonios:', error);
        return {};
    }
}

// Guardar matrimonios
function saveMarriages(marriages) {
    try {
        fs.writeFileSync(MARRIAGES_FILE, JSON.stringify(marriages, null, 2));
    } catch (error) {
        console.error('Error al guardar matrimonios:', error);
    }
}

// Cargar historial de divorcios
function loadDivorces() {
    try {
        const data = fs.readFileSync(DIVORCES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar divorcios:', error);
        return {};
    }
}

// Guardar historial de divorcios
function saveDivorces(divorces) {
    try {
        fs.writeFileSync(DIVORCES_FILE, JSON.stringify(divorces, null, 2));
    } catch (error) {
        console.error('Error al guardar divorcios:', error);
    }
}

// Registrar un divorcio en el historial
function registerDivorce(groupId, user1, user2, initiator = null) {
    const divorces = loadDivorces();
    
    if (!divorces[groupId]) {
        divorces[groupId] = [];
    }
    
    divorces[groupId].push({
        couple: [user1, user2],
        date: new Date().toISOString(),
        initiator: initiator // Quién inició el divorcio (null si fue el dueño)
    });
    
    saveDivorces(divorces);
}

// Comando .casar - Casar a dos usuarios
export const casarCommand = {
    name: 'casar',
    aliases: ['matrimonio', 'boda'],
    description: 'Casa a dos usuarios o cásate con alguien',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        // Obtener ID del remitente
        const senderJid = message.key.participant || message.key.remoteJid;

        // Verificar que se mencionaron usuarios
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, { 
                text: '❌ Debes mencionar al menos a UN usuario.\n\n📝 Opciones de uso:\n• .casar @usuario - Te casas con esa persona\n• .casar @usuario1 @usuario2 - Casas a dos personas' 
            }, { quoted: message });
            return;
        }

        let user1, user2, isOfficiant;

        // Determinar el modo de uso
        if (mentionedJid.length === 1) {
            // Modo 1: El remitente se casa con la persona mencionada
            user1 = senderJid;
            user2 = mentionedJid[0];
            isOfficiant = false; // El remitente es parte de la pareja
        } else if (mentionedJid.length >= 2) {
            // Modo 2: Casa a dos personas mencionadas
            user1 = mentionedJid[0];
            user2 = mentionedJid[1];
            isOfficiant = true; // El remitente es el oficiante
        }


        // Cargar matrimonios
        const marriages = loadMarriages();
        
        // Inicializar grupo si no existe
        if (!marriages[from]) {
            marriages[from] = [];
        }

        // Verificar si esta pareja específica ya está casada entre sí
        const alreadyMarriedTogether = marriages[from].find(couple => 
            (couple[0] === user1 && couple[1] === user2) || 
            (couple[0] === user2 && couple[1] === user1)
        );

        if (alreadyMarriedTogether) {
            await sock.sendMessage(from, {
                text: `⚠️ @${user1.split('@')[0]} y @${user2.split('@')[0]} ya están casados entre sí.\n\n💍 No pueden casarse dos veces con la misma persona.`,
                mentions: [user1, user2]
            }, { quoted: message });
            return;
        }

        // Verificar cuántos matrimonios tiene cada persona (solo para mensaje informativo)
        const user1Marriages = marriages[from].filter(couple => 
            couple.includes(user1)
        ).length;
        
        const user2Marriages = marriages[from].filter(couple => 
            couple.includes(user2)
        ).length;

        const isPolygamy = user1Marriages > 0 || user2Marriages > 0;

        // Guardar el matrimonio
        marriages[from].push([user1, user2]);
        saveMarriages(marriages);

        // Mensaje de boda festivo (diferente según el modo)
        let weddingMessage;
        
        // Mensaje adicional si es poligamia
        let polygamyNote = '';
        if (isPolygamy) {
            const user1Total = user1Marriages + 1; // +1 porque acabamos de agregar el nuevo
            const user2Total = user2Marriages + 1;
            
            if (user1Marriages > 0 && user2Marriages > 0) {
                polygamyNote = `\n\n🔥 ¡POLIGAMIA DETECTADA! 🔥\n@${user1.split('@')[0]} ahora tiene ${user1Total} matrimonio(s)\n@${user2.split('@')[0]} ahora tiene ${user2Total} matrimonio(s)\n💘 ¡El amor no tiene límites! 💘`;
            } else if (user1Marriages > 0) {
                polygamyNote = `\n\n🔥 ¡MATRIMONIO ADICIONAL! 🔥\n@${user1.split('@')[0]} ahora tiene ${user1Total} matrimonio(s)\n💘 ¡Coleccionista de corazones! 💘`;
            } else if (user2Marriages > 0) {
                polygamyNote = `\n\n🔥 ¡MATRIMONIO ADICIONAL! 🔥\n@${user2.split('@')[0]} ahora tiene ${user2Total} matrimonio(s)\n💘 ¡Coleccionista de corazones! 💘`;
            }
        }
        
        if (isOfficiant) {
            // Modo oficiante: casa a dos personas
            weddingMessage = `
╔═══════════════════════════════╗
║   💒 CEREMONIA DE BODA 💒     ║
╚═══════════════════════════════╝

🎊 ¡ATENCIÓN GRUPO! 🎊

Por el poder que me otorga ser el bot más cool de WhatsApp, yo declaro que:

👰 @${user1.split('@')[0]}

Y

🤵 @${user2.split('@')[0]}

🎉 ¡AHORA ESTÁN OFICIALMENTE CASADOS! 🎉

💍 Que vivan los novios 💍
🍾 ¡Felicidades a la pareja! 🍾

👤 Oficiado por: @${senderJid.split('@')[0]}${polygamyNote}

⚠️ Nota: Este matrimonio es legalmente vinculante en el metaverso del grupo 😂

━━━━━━━━━━━━━━━━━━━━━━━━━━
💐 Pueden besar al bot 💐
━━━━━━━━━━━━━━━━━━━━━━━━━━
            `.trim();
        } else {
            // Modo auto-matrimonio: el remitente se casa con alguien
            weddingMessage = `
╔═══════════════════════════════╗
║   💒 CEREMONIA DE BODA 💒     ║
╚═══════════════════════════════╝

🎊 ¡ATENCIÓN GRUPO! 🎊

💕 @${user1.split('@')[0]} ha decidido casarse con @${user2.split('@')[0]} 💕

Por el poder que me otorga ser el bot más cool de WhatsApp, yo declaro que:

👰 @${user1.split('@')[0]}

Y

🤵 @${user2.split('@')[0]}

🎉 ¡AHORA ESTÁN OFICIALMENTE CASADOS! 🎉

💍 Que vivan los novios 💍
🍾 ¡Felicidades a la pareja! 🍾
💘 ¡Qué bonito amor! 💘${polygamyNote}

⚠️ Nota: Este matrimonio es legalmente vinculante en el metaverso del grupo 😂

━━━━━━━━━━━━━━━━━━━━━━━━━━
💐 Pueden besar al bot 💐
━━━━━━━━━━━━━━━━━━━━━━━━━━
            `.trim();
        }

        try {
            const mentions = isOfficiant ? [user1, user2, senderJid] : [user1, user2];
            
            await sock.sendMessage(from, {
                text: weddingMessage,
                mentions: mentions
            });

            console.log(`[BODA] ${user1} y ${user2} han sido casados${isOfficiant ? ' por ' + senderJid : ' (auto-matrimonio)'}`);

        } catch (error) {
            console.error('Error en comando casar:', error);
            await sock.sendMessage(from, {
                text: '❌ Error al realizar la ceremonia de boda.'
            }, { quoted: message });
        }
    }
};

// Comando .casados - Ver lista de matrimonios
export const casadosCommand = {
    name: 'casados',
    aliases: ['matrimonios', 'parejas'],
    description: 'Muestra la lista de parejas casadas en el grupo',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        try {
            const marriages = loadMarriages();
            
            // Verificar si hay matrimonios en este grupo
            if (!marriages[from] || marriages[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '💔 No hay matrimonios registrados en este grupo.\n\n💒 El dueño del bot puede casar parejas con: .casar @usuario1 @usuario2'
                }, { quoted: message });
                return;
            }

            // Crear lista de matrimonios
            let text = '💒 *REGISTRO DE MATRIMONIOS DEL GRUPO* 💒\n\n';
            text += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            const allMentions = [];
            
            marriages[from].forEach((couple, index) => {
                const user1 = couple[0];
                const user2 = couple[1];
                
                text += `${index + 1}. 💑 @${user1.split('@')[0]} 💕 @${user2.split('@')[0]}\n`;
                
                allMentions.push(user1, user2);
            });
            
            text += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👫 Total de parejas: ${marriages[from].length}\n`;
            text += '\n💍 ¡Felicidades a todos los casados! 💍';

            await sock.sendMessage(from, {
                text: text,
                mentions: allMentions
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando casados:', error);
            await sock.sendMessage(from, {
                text: '❌ Error al obtener la lista de matrimonios.'
            }, { quoted: message });
        }
    }
};

// Comando .divorciar - Divorciar a una pareja
export const divorciarCommand = {
    name: 'divorciar',
    aliases: ['divorcio', 'separar'],
    description: 'Divórciate de tu pareja o divorcia a otros (Solo Dueño)',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        // Obtener ID del remitente y limpiar el número
        const senderJid = message.key.participant || message.key.remoteJid;
        const senderNumber = senderJid.split('@')[0].replace(/[^0-9]/g, '');
        
        const isOwner = privilegedConfig.isSuperAdmin(senderJid);

        const marriages = loadMarriages();
        
        // Verificar si hay matrimonios en este grupo
        if (!marriages[from] || marriages[from].length === 0) {
            await sock.sendMessage(from, {
                text: '⚠️ No hay matrimonios registrados en este grupo.'
            }, { quoted: message });
            return;
        }

        // Verificar que se mencionó a alguien
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, { 
                text: '❌ Debes mencionar a alguien.\n\n📝 Opciones de uso:\n• .divorciar @pareja - Te divorcias de tu pareja\n• .divorciar @usuario - (Solo Dueño) Divorcia a esa persona a la fuerza' 
            }, { quoted: message });
            return;
        }

        const mentionedUser = mentionedJid[0];

        let coupleIndex = -1;

        if (isOwner) {
            // El dueño intenta divorciar
            // Si menciona a 2 personas, busca ese matrimonio específico
            if (mentionedJid.length >= 2) {
                const user1 = mentionedJid[0];
                const user2 = mentionedJid[1];
                coupleIndex = marriages[from].findIndex(couple => 
                    (couple.includes(user1) && couple.includes(user2))
                );
            } else {
                // Si solo menciona a 1, busca matrimonios de esa persona
                const userMarriages = marriages[from].map((c, i) => ({ couple: c, index: i }))
                                                    .filter(item => item.couple.includes(mentionedUser));
                
                if (userMarriages.length === 0) {
                    coupleIndex = -1;
                } else if (userMarriages.length === 1) {
                    // Si solo tiene un matrimonio, seleccionamos ese
                    coupleIndex = userMarriages[0].index;
                } else {
                    // Si tiene múltiples, pedimos especificar
                    await sock.sendMessage(from, {
                        text: `⚠️ @${mentionedUser.split('@')[0]} tiene múltiples matrimonios ({${userMarriages.length}}).\n\n📝 Por favor menciona a AMBAS partes para divorciarlos: .divorciar @usuario1 @usuario2`,
                        mentions: [mentionedUser]
                    }, { quoted: message });
                    return;
                }
            }
        } else {
            // Usuario normal intenta divorciarse
            // Busca matrimonio entre senderJid y mentionedUser
            coupleIndex = marriages[from].findIndex(couple => 
                (couple.includes(senderJid) && couple.includes(mentionedUser))
            );
        }

        if (coupleIndex === -1) {
            // Mensaje de error personalizado
            if (isOwner) {
                 await sock.sendMessage(from, {
                    text: `⚠️ No se encontró un matrimonio válido con esa(s) persona(s).`,
                }, { quoted: message });
            } else {
                await sock.sendMessage(from, {
                    text: `⚠️ No estás casado/a con @${mentionedUser.split('@')[0]}.\n\n(O ya te divorciaste y no te diste cuenta 👀)`,
                    mentions: [mentionedUser]
                }, { quoted: message });
            }
            return;
        }

        // Obtener la pareja
        const couple = marriages[from][coupleIndex];
        const user1 = couple[0];
        const user2 = couple[1];

        // Verificaciones adicionales de seguridad ya no son tan necesarias porque
        // la búsqueda ya filtró por senderJid, pero mantenemos por si acaso
        const isPartOfCouple = couple.includes(senderJid);

        if (!isOwner && !isPartOfCouple) {
             // Este caso teóricamente no debería alcanzarse con la nueva lógica de búsqueda
             // pero lo dejamos como fallback
             return;
        }

        // Eliminar el matrimonio
        marriages[from].splice(coupleIndex, 1);
        saveMarriages(marriages);

        // Registrar en el historial de divorcios
        const initiator = isOwner ? null : senderJid;
        registerDivorce(from, user1, user2, initiator);

        // Mensaje diferente según quién ejecuta el divorcio
        let divorceMessage;
        
        if (isOwner) {
            divorceMessage = `
╔═══════════════════════════════╗
║   💔 DIVORCIO OFICIAL 💔      ║
╚═══════════════════════════════╝

😢 Por orden del dueño del bot, declaro que:

@${user1.split('@')[0]}

Y

@${user2.split('@')[0]}

💔 ¡ESTÁN OFICIALMENTE DIVORCIADOS! 💔

📜 El matrimonio ha sido disuelto
🚪 Ambos son libres de nuevo
⚖️ No hay pensión alimenticia en el metaverso

━━━━━━━━━━━━━━━━━━━━━━━━━━
😔 Que cada uno siga su camino 😔
━━━━━━━━━━━━━━━━━━━━━━━━━━
            `.trim();
        } else {
            divorceMessage = `
╔═══════════════════════════════╗
║   💔 DIVORCIO MUTUO 💔        ║
╚═══════════════════════════════╝

😢 Por mutuo acuerdo, declaro que:

@${user1.split('@')[0]}

Y

@${user2.split('@')[0]}

💔 ¡ESTÁN OFICIALMENTE DIVORCIADOS! 💔

📜 El matrimonio ha sido disuelto
🚪 Ambos son libres de nuevo
💸 Se reparten los memes a partes iguales

━━━━━━━━━━━━━━━━━━━━━━━━━━
😔 El amor se acabó 😔
━━━━━━━━━━━━━━━━━━━━━━━━━━
            `.trim();
        }

        try {
            await sock.sendMessage(from, {
                text: divorceMessage,
                mentions: [user1, user2]
            });

            console.log(`[DIVORCIO] ${user1} y ${user2} han sido divorciados${isOwner ? ' por el dueño' : ' mutuamente'}`);

        } catch (error) {
            console.error('Error en comando divorciar:', error);
            await sock.sendMessage(from, {
                text: '❌ Error al procesar el divorcio.'
            }, { quoted: message });
        }
    }
};

// Comando .amor - Menú de comandos románticos
export const amorMenuCommand = {
    name: 'amor',
    aliases: ['romance', 'romantico'],
    description: 'Muestra todos los comandos de amor y romance',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const menuText = `
╔═══════════════════════════════╗
║   💕 COMANDOS DE AMOR 💕      ║
╚═══════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💒 MATRIMONIOS              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.casar @user1 @user2* - Casar a dos personas
🔹 *.casados* - Ver parejas casadas
🔹 *.divorciar @pareja* - Divorciarse

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❤️ INTERACCIONES ROMÁNTICAS ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.kiss @usuario* - Dar un beso 💋
🔹 *.hug @usuario* - Dar un abrazo 🤗
🔹 *.pat @usuario* - Acariciar ✨

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔥 INTERACCIONES PICANTES   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.fuck @usuario* - Follar 🔞
🔹 *.spank @usuario* - Nalgada 🍑
🔹 *.lick @usuario* - Lamer 👅
🔹 *.bite @usuario* - Morder 😈

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  😠 OTRAS INTERACCIONES      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.slap @usuario* - Cachetada 👋

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Cómo usar:*
Menciona al usuario con @ para interactuar

Ejemplo: .kiss @usuario

⚠️ Los matrimonios son permanentes hasta
que uses .divorciar

╔═══════════════════════════════╗
║  Usa .interacciones para ver  ║
║  todas las interacciones      ║
╚═══════════════════════════════╝
        `.trim();

        await sock.sendMessage(message.key.remoteJid, {
            text: menuText
        }, { quoted: message });
    }
};

// Comando .divorciados - Ver historial de divorcios
export const divorciadosCommand = {
    name: 'divorciados',
    aliases: ['divorcios', 'exs'],
    description: 'Muestra el historial de parejas divorciadas en el grupo',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        try {
            const divorces = loadDivorces();
            
            // Verificar si hay divorcios en este grupo
            if (!divorces[from] || divorces[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '💚 ¡Qué bonito! No hay divorcios registrados en este grupo.\n\n💑 Todas las parejas siguen felizmente casadas... por ahora 😏'
                }, { quoted: message });
                return;
            }

            // Crear lista de divorcios
            let text = '💔 *HISTORIAL DE DIVORCIOS DEL GRUPO* 💔\n\n';
            text += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            const allMentions = [];
            
            divorces[from].forEach((divorce, index) => {
                const user1 = divorce.couple[0];
                const user2 = divorce.couple[1];
                const date = new Date(divorce.date);
                const dateStr = date.toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                });
                
                text += `${index + 1}. 💔 @${user1.split('@')[0]} ❌ @${user2.split('@')[0]}\n`;
                text += `   📅 ${dateStr}\n`;
                
                if (divorce.initiator) {
                    text += `   👤 Iniciado por: @${divorce.initiator.split('@')[0]}\n`;
                    allMentions.push(divorce.initiator);
                } else {
                    text += `   👑 Divorcio forzado por el dueño\n`;
                }
                
                text += '\n';
                
                allMentions.push(user1, user2);
            });
            
            text += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            text += `\n💔 Total de divorcios: ${divorces[from].length}\n`;
            text += '\n😢 El amor es complicado...';

            await sock.sendMessage(from, {
                text: text,
                mentions: allMentions
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando divorciados:', error);
            await sock.sendMessage(from, {
                text: '❌ Error al obtener el historial de divorcios.'
            }, { quoted: message });
        }
    }
};

// Comando .mimatrimonio - Ver mis matrimonios
export const miMatrimonioCommand = {
    name: 'mimatrimonio',
    aliases: ['misparejas', 'misboda'],
    description: 'Muestra exclusivamente tus matrimonios en el grupo',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderJid = message.key.participant || message.key.remoteJid;
        
        try {
            const marriages = loadMarriages();
            
            // Verificar si hay matrimonios en este grupo
            if (!marriages[from] || marriages[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '💔 No tienes matrimonios registrados en este grupo.'
                }, { quoted: message });
                return;
            }

            // Filtrar SOLO mis matrimonios
            const myMarriages = marriages[from].filter(couple => 
                couple.includes(senderJid)
            );

            if (myMarriages.length === 0) {
                await sock.sendMessage(from, {
                    text: '💔 Aún no te has casado, pero el amor llegará pronto...'
                }, { quoted: message });
                return;
            }

            // Crear lista de MIS matrimonios
            let text = '💒 *MIS MATRIMONIOS* 💒\n\n';
            text += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            const mentions = [senderJid];
            
            myMarriages.forEach((couple, index) => {
                // Encontrar a la pareja (el que no es el sender)
                const partner = couple[0] === senderJid ? couple[1] : couple[0];
                
                text += `${index + 1}. 💑 Tú 💕 @${partner.split('@')[0]}\n`;
                mentions.push(partner);
            });
            
            text += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            text += `\n💘 Total de amores: ${myMarriages.length}\n`;

            await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando mimatrimonio:', error);
            await sock.sendMessage(from, {
                text: '❌ Error al obtener tus matrimonios.'
            }, { quoted: message });
        }
    }
};

export const marriageCommands = [
    amorMenuCommand,
    casarCommand,
    casadosCommand,
    divorciarCommand,
    divorciadosCommand,
    miMatrimonioCommand
];
