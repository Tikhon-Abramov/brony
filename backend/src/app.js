import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import referenceRoutes from './routes/reference.routes.js';
import { notFoundMiddleware } from './middleware/not-found.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';

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

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    return app;
}