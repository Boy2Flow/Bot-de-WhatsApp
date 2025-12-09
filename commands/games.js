import NodeCache from 'node-cache';

const gameCache = new NodeCache({ stdTTL: 300 }); // 5 minutos

// Juego: Piedra, Papel o Tijera
const pptCommand = {
    name: 'ppt',
    aliases: ['piedrapapeltijera', 'rps'],
    description: 'Juega Piedra, Papel o Tijera',
    execute: async (sock, message, args) => {
        const choices = ['piedra', 'papel', 'tijera'];
        const userChoice = args[0]?.toLowerCase();

        if (!userChoice || !choices.includes(userChoice)) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso: *.ppt [piedra/papel/tijera]*\n\nEjemplo: .ppt piedra'
            }, { quoted: message });
            return;
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        let result = '';
        if (userChoice === botChoice) {
            result = '🤝 ¡Empate!';
        } else if (
            (userChoice === 'piedra' && botChoice === 'tijera') ||
            (userChoice === 'papel' && botChoice === 'piedra') ||
            (userChoice === 'tijera' && botChoice === 'papel')
        ) {
            result = '🎉 ¡Ganaste!';
        } else {
            result = '😔 ¡Perdiste!';
        }

        const emojis = {
            piedra: '🪨',
            papel: '📄',
            tijera: '✂️'
        };

        const responseText = `
🎮 *PIEDRA, PAPEL O TIJERA*

Tu elección: ${emojis[userChoice]} ${userChoice}
Mi elección: ${emojis[botChoice]} ${botChoice}

${result}
        `.trim();

        await sock.sendMessage(message.key.remoteJid, {
            text: responseText
        }, { quoted: message });
    }
};

// Juego: Adivina el número
const adivinaCommand = {
    name: 'adivina',
    aliases: ['guess', 'numero'],
    description: 'Adivina el número del 1 al 10',
    execute: async (sock, message, args) => {
        const userNumber = parseInt(args[0]);

        if (!userNumber || userNumber < 1 || userNumber > 10) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso: *.adivina [número del 1 al 10]*\n\nEjemplo: .adivina 7'
            }, { quoted: message });
            return;
        }

        const randomNumber = Math.floor(Math.random() * 10) + 1;
        const won = userNumber === randomNumber;

        const responseText = `
🎲 *ADIVINA EL NÚMERO*

Tu número: ${userNumber}
Número secreto: ${randomNumber}

${won ? '🎉 ¡Acertaste! ¡Felicidades!' : '😔 ¡Fallaste! Intenta de nuevo.'}
        `.trim();

        await sock.sendMessage(message.key.remoteJid, {
            text: responseText
        }, { quoted: message });
    }
};

// Juego: Trivia
const triviaCommand = {
    name: 'trivia',
    aliases: ['pregunta', 'quiz'],
    description: 'Responde preguntas de trivia',
    execute: async (sock, message, args) => {
        const questions = [
            {
                question: '¿Cuál es la capital de Francia?',
                options: ['A) Londres', 'B) París', 'C) Madrid', 'D) Roma'],
                answer: 'B',
                explanation: 'París es la capital de Francia 🇫🇷'
            },
            {
                question: '¿Cuántos continentes hay en el mundo?',
                options: ['A) 5', 'B) 6', 'C) 7', 'D) 8'],
                answer: 'C',
                explanation: 'Hay 7 continentes: África, América, Antártida, Asia, Europa, Oceanía'
            },
            {
                question: '¿Qué planeta es conocido como el planeta rojo?',
                options: ['A) Venus', 'B) Marte', 'C) Júpiter', 'D) Saturno'],
                answer: 'B',
                explanation: 'Marte es conocido como el planeta rojo 🔴'
            },
            {
                question: '¿En qué año llegó el hombre a la Luna?',
                options: ['A) 1965', 'B) 1967', 'C) 1969', 'D) 1971'],
                answer: 'C',
                explanation: 'El hombre llegó a la Luna en 1969 🌙'
            },
            {
                question: '¿Cuál es el océano más grande del mundo?',
                options: ['A) Atlántico', 'B) Índico', 'C) Ártico', 'D) Pacífico'],
                answer: 'D',
                explanation: 'El Océano Pacífico es el más grande 🌊'
            }
        ];

        const userId = message.key.participant || message.key.remoteJid;
        const from = message.key.remoteJid;
        const cacheKey = `trivia_${from}_${userId}`;
        const currentGame = gameCache.get(cacheKey);

        if (!args[0]) {
            // Nueva pregunta
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            gameCache.set(cacheKey, randomQuestion);

            const questionText = `
🧠 *TRIVIA*

${randomQuestion.question}

${randomQuestion.options.join('\n')}

Responde con: *.trivia [letra]*
Ejemplo: .trivia B
            `.trim();

            await sock.sendMessage(message.key.remoteJid, {
                text: questionText
            }, { quoted: message });
        } else {
            // Verificar respuesta
            if (!currentGame) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ No hay ninguna pregunta activa. Usa *.trivia* para empezar.'
                }, { quoted: message });
                return;
            }

            const userAnswer = args[0].toUpperCase();
            const correct = userAnswer === currentGame.answer;

            const responseText = `
${correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}

${currentGame.explanation}

${correct ? '🎉 ¡Bien hecho!' : 'Intenta con otra pregunta usando *.trivia*'}
            `.trim();

            await sock.sendMessage(message.key.remoteJid, {
                text: responseText
            }, { quoted: message });

            gameCache.del(cacheKey);
        }
    }
};

// Juego: Dado
const dadoCommand = {
    name: 'dado',
    aliases: ['dice', 'roll'],
    description: 'Lanza un dado virtual',
    execute: async (sock, message) => {
        const result = Math.floor(Math.random() * 6) + 1;
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        await sock.sendMessage(message.key.remoteJid, {
            text: `🎲 *LANZAMIENTO DE DADO*\n\n${diceEmojis[result - 1]} Resultado: *${result}*`
        }, { quoted: message });
    }
};

// Juego: Moneda
const monedaCommand = {
    name: 'moneda',
    aliases: ['coin', 'flip'],
    description: 'Lanza una moneda (cara o cruz)',
    execute: async (sock, message) => {
        const result = Math.random() < 0.5 ? 'Cara' : 'Cruz';
        const emoji = result === 'Cara' ? '🙂' : '❌';

        await sock.sendMessage(message.key.remoteJid, {
            text: `🪙 *LANZAMIENTO DE MONEDA*\n\n${emoji} Resultado: *${result}*`
        }, { quoted: message });
    }
};

export const gameCommands = [
    pptCommand,
    adivinaCommand,
    triviaCommand,
    dadoCommand,
    monedaCommand
];
