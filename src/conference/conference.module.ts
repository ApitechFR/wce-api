import { ProsodyModule } from './../prosody/prosody.module';
import { Module } from '@nestjs/common';
import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WhiteListedDomains,
  WhiteListedDomainsSchema,
} from '../schemas/WhiteListedDomains.schema';
import { ConferenceControllerJoona } from './conference.controller.joona';
import { ConferenceServiceJoona } from './conference.service.joona';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conference } from './entities/conference.entity';

const isMongodb = process.env.DB_TYPE === 'mongodb';
const isGouv = process.env.IS_GOUV === 'true';

@Module({
  imports: [
    ProsodyModule,
    ...(isMongodb
      ? [
          MongooseModule.forFeature([
            {
              name: WhiteListedDomains.name,
              schema: WhiteListedDomainsSchema,
            },
          ]),
        ]
      : [TypeOrmModule.forFeature([Conference])]),
  ],
  controllers: isGouv
    ? [ConferenceController]
    : [ConferenceControllerJoona],
  providers: isGouv
    ? [ConferenceService]
    : [ConferenceServiceJoona],
  exports: isGouv
    ? [ConferenceService]
    : [ConferenceServiceJoona],
})
export class ConferenceModule {}
