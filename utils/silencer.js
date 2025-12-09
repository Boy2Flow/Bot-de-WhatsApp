
// Interceptores nucleares para silenciar logs molestos de librerías
// Esto intercepta tanto console.log como process.stdout.write (usado por pino/loggers)

const logsToSilence = [
    'Closing session: SessionEntry',
    'Removing old closed session'
];

function shouldSilence(str) {
    if (!str) return false;
    const s = str.toString();
    return logsToSilence.some(phrase => s.includes(phrase));
}

// 1. Interceptar process.stdout y process.stderr (Nivel más bajo)
const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

process.stdout.write = function(chunk, encoding, callback) {
    if (shouldSilence(chunk)) return true;
    return originalStdoutWrite.apply(process.stdout, arguments);
};

process.stderr.write = function(chunk, encoding, callback) {
    if (shouldSilence(chunk)) return true;
    return originalStderrWrite.apply(process.stderr, arguments);
};

// 2. Interceptar console (Nivel alto)
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    if (!shouldSilence(msg)) originalLog.apply(console, args);
};

console.error = (...args) => {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    if (!shouldSilence(msg)) originalError.apply(console, args);
};
