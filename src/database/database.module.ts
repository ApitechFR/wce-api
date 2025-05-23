import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbacks } from "../feedback/entities/feedback.entity";
import { Conference } from '../conference/entities/conference.entity';
import { Replay } from '../replay/entities/replay.entity';
import { User } from '../users/entities/users.entity';
import { Participant } from '../participant/entities/participant.entity';

@Module({})
export class DatabaseModule {
  static async register(configService: ConfigService): Promise<DynamicModule> {
    const dbType = configService.get<string>('DB_TYPE');
    console.log({dbType})

    if (dbType === 'mongodb') {
      console.log("mongodb");
      return {
        module: DatabaseModule,
        imports: [
          MongooseModule.forRoot(configService.get<string>('MONGO_URI')),
        ],
      };
    }

    if (dbType === 'mariadb') {
      console.log("mariadb");
      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forRoot({
            type: 'mariadb',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [Feedbacks, Conference, Replay, User, Participant],
            autoLoadEntities: true,
            synchronize: configService.get<string>('NODE_ENV') === 'development',
          }),
        ],
      };
    }

    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
  }
}