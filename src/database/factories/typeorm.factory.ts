import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import { User } from 'src/users/entities/users.entity';
import { Replay } from 'src/replay/entities/replay.entity';

export const createTypeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions | undefined> => {
    const dbType = configService.get<string>('DB_TYPE');

    if (dbType !== 'mariadb') return undefined;

    return {
        type: 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Feedback, Participant, User, Replay],
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
    };
};
