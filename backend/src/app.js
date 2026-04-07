import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import referenceRoutes from './routes/reference.routes.js';
import eventsRoutes from './routes/events.routes.js';
import { notFoundMiddleware } from './middleware/not-found.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

export function createApp() {
    const app = express();

    app.use(
        cors({
            origin: env.clientUrl,
            credentials: true,
        }),
    );

    app.use(express.json());

    app.get('/api/health', (req, res) => {
        res.json({ ok: true });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/bookings', bookingsRoutes);
    app.use('/api/reference', referenceRoutes);
    app.use('/api/events', eventsRoutes);

    app.use(express.static(frontendDistPath));

    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }

        return res.sendFile(path.join(frontendDistPath, 'index.html'));
    });

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    return app;
}