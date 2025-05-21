import { ConfigModule, ConfigService } from "@nestjs/config";
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from '@nestjs/mongoose';
import { Feedbacks } from "../feedback/entities/feedback.entity";
import { Conference } from '../conference/entities/conference.entity';
import { Replay } from '../replay/entities/replay.entity';
import { User } from '../users/entities/users.entity';
import { Participant } from '../participant/entities/participant.entity';


export const databaseProvider = (configService: ConfigService) => {
    const db_type = configService.get<String>('DB_TYPE');

    console.log({db_type})
    if(db_type === 'mongodb') {
        console.log("mongodb")
        return MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                uri: configService.get('MONGO_URI'),
            }),
        });
    }
    
    if (db_type === 'mariadb') {
        console.log("mariadb")
        return TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                type: 'mariadb',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [Feedbacks, Conference, Replay, User, Participant],
                autoLoadEntities: true,
                synchronize:
                configService.get<string>('NODE_ENV') === 'development'
                    ? true
                    : false, // Set to `false` in production
            }),
        });
    }
    throw new Error(`Unsupported DB_TYPE: ${db_type}`);
}


// export const databaseProvider = (configService: ConfigService) => {

//     const db_type = configService.get<String>('DB_TYPE');
//     if (db_type === 'mariadb') {
//         return TypeOrmModule.forRootAsync({
//             imports: [],
//             inject: [ConfigService],
//             useFactory: () => ({
//                 type: 'mariadb',
//                 host: configService.get<string>('DB_HOST'),
//                 port: configService.get<number>('DB_PORT'),
//                 username: configService.get<string>('DB_USERNAME'),
//                 password: configService.get<string>('DB_PASSWORD'),
//                 database: configService.get<string>('DB_NAME'),
//                 entities: [Feedback, Conference, Replay, User, Participant],
//                 autoLoadEntities: true,
//                 synchronize:
//                 configService.get<string>('NODE_ENV') === 'development'
//                     ? true
//                     : false, // Set to `false` in production
//             }),
//         });
//     }   
//     if (db_type === 'mongodb') {
//       return MongooseModule.forRootAsync({
//         inject: [ConfigService],
//         useFactory: () => ({
//           uri: configService.get<string>('MONGO_URI'),
//         }),
//       });
//     }   
//     throw new Error(`Unsupported DB_TYPE: ${db_type}`);
// };
