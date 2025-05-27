import { Module } from '@nestjs/common';
import { ReplayService } from './replay.service';
import { ReplayController } from './replay.controller';
import { ReplayControllerJoona } from './replay.controller.joona';
import { ReplayServiceJoona } from './replay.service.joona';

const isGouv = process.env.IS_GOUV === 'true';

@Module({
  controllers: isGouv
    ? [ReplayController]
    : [ReplayControllerJoona],
  providers: isGouv
    ? [ReplayService]
    : [ReplayServiceJoona],
})
export class ReplayModule {}
