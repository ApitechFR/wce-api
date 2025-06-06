import { Module } from '@nestjs/common';
import { ReplayService } from './replay.service';
import { ReplayController } from './replay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Replay as ReplayEntity } from './entities/replay.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReplayEntity]),
  ],
  providers: [ReplayService],
  controllers: [ReplayController],
})
export class ReplayModule {}
