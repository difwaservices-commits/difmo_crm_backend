// @ts-nocheck
import { DataSource } from 'typeorm';
import { Permission } from '../src/modules/access-control/permission.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

const AppDataSource = new DataSource({
    type: dbUrl && dbUrl.startsWith('postgres') ? 'postgres' : 'sqlite',
    database: dbUrl && dbUrl.startsWith('postgres') ? undefined : 'db.sqlite',
    url: dbUrl,
    entities: [Permission],
    synchronize: false,
    ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const permissionRepository = AppDataSource.getRepository(Permission);

        const resources = [
            'user',
            'employee',
            'attendance',
            'leave',
            'department',
            'company',
            'role',
            'permission',
            'task',
            'client',
            'project',
            'payroll',
            'time-tracking',
            'monitoring',
            'job',
            'expense',
            'dashboard',
            'access-control',
            'personal_leaves',
            'personal_attendance',
            'personal_payroll',
        ];
        const actions = ['create', 'read', 'update', 'delete', 'manage'];

        for (const resource of resources) {
            for (const action of actions) {
                const existing = await permissionRepository.findOne({
                    where: { action, resource },
                });
                if (!existing) {
                    await permissionRepository.save({
                        action,
                        resource,
                        description: `Can ${action} ${resource}`,
                    });
                    console.log(`Added permission: ${action} ${resource}`);
                }
            }
        }

        console.log('Done seeding permissions');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error seeding:', error);
    }
}

seed();
