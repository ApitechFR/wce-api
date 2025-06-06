import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';

import { ConferenceController } from './conference.controller';
import { Conference } from './entities/conference.entity';
import { ProsodyModule } from '../prosody/prosody.module';
import { RoomNameValidator } from '../common/validators/room-name.validator';
import { ConferenceServiceMongo } from './services/conference.service.mongo';
import { ConferenceServiceSQL } from './services/conference.service.sql';
import { IConferenceService } from './interfaces/conference-service.interface';
import { WhiteListedDomains, WhiteListedDomainsSchema } from '../schemas/WhiteListedDomains.schema';
import { Participant } from '../participant/entities/participant.entity';
import { Replay } from '../replay/entities/replay.entity';
import { User } from '../users/entities/users.entity';


const isMongo = process.env.DB_TYPE === 'mongodb';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    JwtModule,
    MailerModule,
    ProsodyModule,
    ...(isMongo
      ? [
        MongooseModule.forFeature([
          { name: WhiteListedDomains.name, schema: WhiteListedDomainsSchema },
        ]),
      ]
      : [TypeOrmModule.forFeature([Conference, Participant, Replay, User])]),
  ],
  controllers: [ConferenceController],
  providers: [
    RoomNameValidator,
    ...(isMongo ? [ConferenceServiceMongo] : [ConferenceServiceSQL]),
    {
      provide: IConferenceService,
      useClass: isMongo ? ConferenceServiceMongo : ConferenceServiceSQL,
    },
  ],
  exports: [IConferenceService],
})
export class ConferenceModule { }
