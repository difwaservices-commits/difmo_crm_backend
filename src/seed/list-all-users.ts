import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';

require('dotenv').config();

async function listUsers() {
    const dbUrl = process.env.DATABASE_URL;
    const AppDataSource = new DataSource({
        type: 'postgres',
        url: dbUrl,
        entities: [User],
        synchronize: false,
        ssl: dbUrl && dbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    } as any);

    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected');
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find();
        console.log('--- ALL USERS ---');
        users.forEach(u => {
            console.log(`ID: ${u.id} | Email: ${u.email} | Name: ${u.firstName} ${u.lastName}`);
        });
        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

listUsers();
