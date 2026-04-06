import { env } from '../config/env.js';
import { testDbConnection } from '../config/db.js';
import { hashPassword } from '../utils/password.js';
import { createOrUpdateAdmin } from '../services/user.service.js';

async function main() {
    try {
        await testDbConnection();

        const passwordHash = await hashPassword(env.admin.password);

        const user = await createOrUpdateAdmin({
            name: env.admin.name,
            login: env.admin.login,
            passwordHash,
        });

        console.log('Admin user is ready:');
        console.log({
            id: user.id,
            name: user.name,
            login: user.login,
            role: user.role,
        });

        process.exit(0);
    } catch (error) {
        console.error('Failed to create admin:', error);
        process.exit(1);
    }
}

main();