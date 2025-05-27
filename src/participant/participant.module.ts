import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { ParticipantControllerJoona } from './participant.controller.joona';
import { ParticipantServiceJoona } from './participant.service.joona';

const isGouv = process.env.IS_GOUV === 'true';

@Module({
  controllers: isGouv
    ? [ParticipantController]
    : [ParticipantControllerJoona],
  providers: isGouv
    ? [ParticipantService]
    : [ParticipantServiceJoona],
})
export class ParticipantModule {}
