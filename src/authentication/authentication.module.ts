import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { ConferenceModule } from 'src/conference/conference.module';
import { ConferenceService } from 'src/conference/conference.service';
import { ProsodyService } from 'src/prosody/prosody.service';

@Module({
  imports: [HttpModule, ConferenceModule],
  providers: [AuthenticationService, ConferenceService, ProsodyService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
