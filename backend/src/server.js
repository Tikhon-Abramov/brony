import { createApp } from './app.js';
import { env } from './config/env.js';
import { testDbConnection } from './config/db.js';
import { refreshExpiredBookings } from './services/booking.service.js';
import { logError, logInfo } from './utils/logger.js';

async function bootstrap() {
    try {
        await testDbConnection();
        await refreshExpiredBookings();

        const app = createApp();

        app.listen(env.port, () => {
            logInfo(`Backend started on http://localhost:${env.port}`);
        });

        setInterval(async () => {
            try {
                await refreshExpiredBookings();
            } catch (error) {
                logError('Failed to refresh expired bookings', {
                    message: error.message,
                    stack: error.stack,
                });
            }
        }, 60_000);
    } catch (error) {
        logError('Failed to start backend', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
}

bootstrap();