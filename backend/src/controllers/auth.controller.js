import { findUserByLogin } from '../services/user.service.js';
import { signAccessToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/password.js';

export async function login(req, res, next) {
    try {
        const { login, password } = req.body ?? {};

        if (!login || !password) {
            return res.status(400).json({
                message: 'Укажи логин и пароль',
            });
        }

        const user = await findUserByLogin(login);

        if (!user) {
            return res.status(401).json({
                message: 'Неверный логин или пароль',
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = signAccessToken({
            sub: user.id,
            role: user.role,
            login: user.login,
            name: user.name,
        });

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                login: user.login,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function me(req, res) {
    return res.json({
        user: req.user,
    });
}