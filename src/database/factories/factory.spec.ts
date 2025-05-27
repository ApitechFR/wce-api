import { createMongooseConfig } from './mongoose.factory';
import { createTypeOrmConfig } from './typeorm.factory';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

describe('Database config factories', () => {
    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return MongoDB config when DB_TYPE is mongodb', async () => {
        mockConfigService.get.mockImplementation((key) => {
            if (key === 'DB_TYPE') return 'mongodb';
            if (key === 'MONGO_URI') return 'mongodb://mongo:27017/nest_dev';
        });

        const config = await createMongooseConfig(mockConfigService as any);
        expect(config.uri).toBe('mongodb://mongo:27017/nest_dev');
    });

    it('should return TypeORM config when DB_TYPE is mariadb', async () => {
        mockConfigService.get.mockImplementation((key) => {
            const values = {
                DB_TYPE: 'mariadb',
                DB_HOST: 'localhost',
                DB_PORT: 3306,
                DB_USERNAME: 'root',
                DB_PASSWORD: 'secret',
                DB_NAME: 'testdb',
                NODE_ENV: 'development',
            };
            return values[key];
        });

        const config = (await createTypeOrmConfig(mockConfigService as any)) as TypeOrmModuleOptions;

        expect(config).toBeDefined();
        expect(config?.type).toBe('mariadb');

        // Vérification des propriétés spécifiques
        expect('host' in config).toBe(true);
        expect((config as any).host).toBe('localhost');

        expect('database' in config).toBe(true);
        expect((config as any).database).toBe('testdb');
    });

    it('should return undefined TypeORM config when DB_TYPE is mongodb', async () => {
        mockConfigService.get.mockImplementation((key) => {
            if (key === 'DB_TYPE') return 'mongodb';
        });

        const config = await createTypeOrmConfig(mockConfigService as any);
        expect(config).toBeUndefined();
    });
});
