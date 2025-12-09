import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startBot() {
    console.log('🚀 Iniciando bot...');

    // Iniciar el proceso del bot (index.js)
    const child = spawn('node', ['index.js'], {
        cwd: __dirname,
        stdio: ['inherit', 'pipe', 'pipe'], // Capturar stdout y stderr
        shell: true,
        env: { ...process.env, BOT_LAUNCHER_ACTIVE: 'true' }
    });

    const filterLog = (data, stream) => {
        const output = data.toString();
        // Filtrar mensajes específicos de Baileys/Auth que no son errores reales
        if (!output.includes('Closing session: SessionEntry') &&
            !output.includes('Removing old closed session')) {
            stream.write(data);
        }
    };

    child.stdout.on('data', (data) => filterLog(data, process.stdout));
    child.stderr.on('data', (data) => filterLog(data, process.stderr));

    // Manejar cierre del proceso
    child.on('close', (code) => {
        // Si el código es null, fue terminado por una señal (ej: SIGINT/Ctrl+C)
        if (code === null) {
            console.log('🛑 Bot detenido manualmente.');
            process.exit(0);
        }

        // Si se cerró con cualquier código (0 por reload, 1 por error), reiniciamos
        console.log(`⚠️ Bot detenido con código ${code}. Reiniciando en 3 segundos...`);
        setTimeout(() => {
            startBot();
        }, 3000);
    });

    child.on('error', (err) => {
        console.error('Error al iniciar el proceso del bot:', err);
    });
}

startBot();
