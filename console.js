import fs from 'fs';
import path from 'path';
import readline from 'readline';

const IPC_FILE = path.join(process.cwd(), 'ipc_commands.json');

console.log('🤖 CONSOLA DE COMANDOS DEL BOT');
console.log('------------------------------');
console.log('Escribe un comando (ej: .ping) y presiona Enter.');
console.log('Escribe "exit" para salir.');
console.log('\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Bot> '
});

rl.prompt();

rl.on('line', (line) => {
    const cmd = line.trim();

    if (cmd === 'exit') {
        process.exit(0);
    }

    if (cmd) {
        try {
            fs.writeFileSync(IPC_FILE, JSON.stringify({ command: cmd }));
            // console.log('✅ Enviado.'); // Opcional, mejor mantener limpia la interfaz
        } catch (e) {
            console.error('❌ Error enviando comando:', e.message);
        }
    }

    rl.prompt();
});
