import { verifyAccessToken } from '../utils/jwt.js';
import { findUserById } from '../services/user.service.js';

export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Требуется авторизация',
            });
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                message: 'Требуется авторизация',
            });
        }

        const payload = verifyAccessToken(token);
        const user = await findUserById(payload.sub);

        if (!user) {
            return res.status(401).json({
                message: 'Пользователь не найден',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Недействительный или просроченный токен',
        });
    }
}

export function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Недостаточно прав',
        });
    }

    next();
}