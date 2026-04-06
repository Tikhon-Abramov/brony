import { createApp } from './app.js';
import { env } from './config/env.js';
import { testDbConnection } from './config/db.js';

async function bootstrap() {
    try {
        await testDbConnection();

        const app = createApp();

        app.listen(env.port, () => {
            console.log(`Backend started on http://localhost:${env.port}`);
        });
    } catch (error) {
        console.error('Failed to start backend:', error);
        process.exit(1);
    }
}

bootstrap();