import fs from 'fs';
import path from 'path';

const logsDir = path.resolve(process.cwd(), 'logs');
const errorLogPath = path.join(logsDir, 'error.log');

function ensureLogsDir() {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
}

function formatMessage(level, message, meta = {}) {
    return JSON.stringify({
        level,
        message,
        meta,
        timestamp: new Date().toISOString(),
    });
}

export function logInfo(message, meta = {}) {
    const line = formatMessage('info', message, meta);
    console.log(line);
}

export function logError(message, meta = {}) {
    ensureLogsDir();

    const line = formatMessage('error', message, meta);
    console.error(line);
    fs.appendFileSync(errorLogPath, `${line}\n`, 'utf8');
}