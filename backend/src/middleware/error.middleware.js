import { logError } from '../utils/logger.js';

export function errorMiddleware(error, req, res, next) {
    const status = error.status || 500;

    logError(error.message || 'Internal server error', {
        status,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id ?? null,
        stack: error.stack || null,
    });

    res.status(status).json({
        message: error.message || 'Внутренняя ошибка сервера',
    });
}