import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURACIÓN DE LA INTERFAZ ---
const screen = blessed.screen({
    smartCSR: true,
    title: '🤖 B2F BOT CONTROL CENTER 🤖',
    fullUnicode: true,
    autoPadding: true,
    warnings: false
});

// Mensaje de ayuda en la parte inferior
const helpBar = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: ' {cyan-fg}[ESC/Q]{/cyan-fg} Exit  {cyan-fg}[↑↓]{/cyan-fg} Scroll Commands  {cyan-fg}[Ctrl+C]{/cyan-fg} Force Quit',
    tags: true,
    style: {
        fg: 'white',
        bg: 'black'
    }
});
screen.append(helpBar);

// Crear Grid con mejor distribución
const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// 1. Gráfico de Recursos - Más grande y prominente (arriba izquierda)
const cpuLine = grid.set(0, 0, 5, 9, contrib.line, {
    style: { 
        line: "yellow", 
        text: "green", 
        baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    legend: { width: 12 },
    label: '📊 SYSTEM RESOURCES',
    border: {type: "line", fg: "cyan"}
});

// 2. Panel de Estadísticas (arriba derecha)
const statsBox = grid.set(0, 9, 5, 3, blessed.box, {
    label: '📈 STATS',
    content: '',
    tags: true,
    border: {type: "line", fg: "cyan"},
    style: {
        fg: 'green',
        border: { fg: 'cyan' }
    }
});

// 3. Log Principal (Terminal) - Más ancho
const logBox = grid.set(5, 0, 6, 9, contrib.log, {
    fg: "green",
    selectedFg: "green",
    label: '💻 SYSTEM TERMINAL',
    border: {type: "line", fg: "cyan"},
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: '█',
        style: { fg: 'cyan' }
    }
});

// 4. Lista de Comandos Ejecutados - Más alta
const commandList = grid.set(5, 9, 6, 3, contrib.table, {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: '⚡ DETECTED COMMANDS',
    border: {type: "line", fg: "cyan"},
    columnSpacing: 1,
    columnWidth: [8, 12, 12]
});

// Datos iniciales para la tabla de comandos
let commandData = [];
commandList.setData({headers: ['CMD', 'PHONE', 'NAME'], data: commandData});

// Datos simulados para el gráfico
let cpuData = {
    title: 'CPU',
    style: { line: 'red' },
    x: Array(10).fill().map((_, i) => i.toString()),
    y: Array(10).fill(0)
};
let ramData = {
    title: 'RAM',
    style: { line: 'yellow' },
    x: Array(10).fill().map((_, i) => i.toString()),
    y: Array(10).fill(0)
};
cpuLine.setData([cpuData, ramData]);

// Variables de estadísticas
let botStartTime = Date.now();
let totalCommands = 0;
let totalMessages = 0;
let botStatus = 'STARTING';

// Función para actualizar estadísticas
function updateStats() {
    const uptime = Math.floor((Date.now() - botStartTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    
    statsBox.setContent(
        `{cyan-fg}UPTIME:{/cyan-fg}\n` +
        `{green-fg}${hours}h ${minutes}m ${seconds}s{/green-fg}\n\n` +
        `{cyan-fg}STATUS:{/cyan-fg}\n` +
        `{green-fg}${botStatus}{/green-fg}\n\n` +
        `{cyan-fg}COMMANDS:{/cyan-fg}\n` +
        `{yellow-fg}${totalCommands}{/yellow-fg}\n\n` +
        `{cyan-fg}MESSAGES:{/cyan-fg}\n` +
        `{yellow-fg}${totalMessages}{/yellow-fg}`
    );
}

// Actualizar gráfico y stats cada segundo
setInterval(() => {
    // Simular datos
    cpuData.y.shift();
    cpuData.y.push(Math.random() * 30 + 10);
    
    ramData.y.shift();
    ramData.y.push(Math.random() * 20 + 40);

    cpuLine.setData([cpuData, ramData]);
    updateStats();
    screen.render();
}, 1000);


// --- LÓGICA DEL BOT ---

let botProcess = null;

function startBot() {
    logBox.log("INITIALIZING SYSTEM...");
    logBox.log("EXECUTING BOOT SEQUENCE...");

    botProcess = spawn('node', ['index.js'], {
        cwd: __dirname,
        stdio: ['ignore', 'pipe', 'pipe'] // Pipe stdout/stderr
    });

    botProcess.stdout.on('data', (data) => {
        const str = data.toString().trim();
        
        // Detectar estado del bot
        if (str.includes('Bot conectado exitosamente')) {
            botStatus = '🟢 ONLINE';
            botStartTime = Date.now(); // Resetear uptime al conectar
        } else if (str.includes('Conexión cerrada')) {
            botStatus = '🔴 OFFLINE';
        }
        
        // Detectar comandos ejecutados (formato CMD_EXEC:comando:telefono:nombre)
        if (str.includes('CMD_EXEC:')) {
            const parts = str.split(':', 4);
            if (parts.length >= 4) {
                const cmd = parts[1].trim();
                const phone = parts[2].trim();
                const name = parts[3].trim() || 'Unknown';
                
                // Agregar a la lista (mantener últimos 20)
                commandData.unshift([`.${cmd}`, phone, name]);
                if (commandData.length > 20) commandData.pop();
                
                commandList.setData({headers: ['CMD', 'PHONE', 'NAME'], data: commandData});
                totalCommands++;
            }
        } else {
            // Log normal
            logBox.log(str);
            
            // Contar mensajes (si el log contiene indicadores de mensaje)
            if (str.includes('messages.upsert') || str.includes('Mensaje de')) {
                totalMessages++;
            }
        }
        screen.render();
    });

    botProcess.stderr.on('data', (data) => {
        const errStr = data.toString().trim();
        // Filtrar errores de sesión que ya manejamos
        if (!errStr.includes('decrypt') && !errStr.includes('Bad MAC')) {
            logBox.log(`{red-fg}ERROR: ${errStr}{/red-fg}`);
            screen.render();
        }
    });

    botProcess.on('close', (code) => {
        if (code === null) {
            logBox.log("SYSTEM HALTED MANUALLY.");
            return;
        }

        logBox.log(`SYSTEM CRASH/RESTART (Code: ${code})`);
        logBox.log("REBOOTING IN 3 SECONDS...");
        screen.render();

        setTimeout(() => {
            startBot();
        }, 3000);
    });
}

// Iniciar
startBot();

// Manejar salida
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    if (botProcess) botProcess.kill();
    return process.exit(0);
});

screen.render();
