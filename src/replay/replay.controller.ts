import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ReplayService } from './replay.service';
import { CreateReplayDto, UpdateReplayDto } from './DTOs/replay.dto';
import { Replay } from './entities/replay.entity';

interface RegisterEvent {
  confname: string;
  eventid: string;
  jwt: string;
  uploadCallbackUrl: string;
  uploadCallbackDomainUrl: string;
}

@Controller('api/visioreplay')
export class ReplayController {
  private tab: RegisterEvent[];
  constructor(private readonly replayService: ReplayService) {
    this.tab = [];
  }

  @Post('start_recording')
  async createReplay(@Body() data: CreateReplayDto): Promise<Replay> {
    try {
      return await this.replayService.createReplay(data);
    } catch (error) {
      throw new HttpException(
        { message: 'Cannot create replay', error: error.message },
        error.status ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('end_recording/confname/:conference_name')
  async updateReplayByConfName(
    @Param('conference_name') conference_name: string,
    @Body() data: UpdateReplayDto,
  ) {
    try {
      const updatedReplay = await this.replayService.updateReplayByConfName(conference_name, data);
      return { status: updatedReplay.status };
    } catch (error) {
      throw new HttpException(
        { message: 'Cannot find replay', error: error.message },
        error.status ?? HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put('end_recording/:uid')
  async updateReplayByUID(
    @Param('uid') uid: string,
    @Body() updateReplayDto: UpdateReplayDto,
  ) {
    try {
      const replay = await this.replayService.updateReplayByUID(uid, updateReplayDto);

      const isEnabled = process.env.ENABLE_JIBRI_APITECH_API === 'true';

      if (isEnabled && replay.status === 'uploaded-rsync') {
        // TO DO
      } else {
        return { status: replay.status };
      }

    } catch (error) {
      throw new HttpException(
        { message: 'Cannot find replay', error: error.message },
        error.status ?? HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findReplay/:conference_name')
  async findReplayByConfName(@Param('conference_name') conference_name: string): Promise<string> {
    try {
      const replay = await this.replayService.findReplayByConfName(conference_name);

      if (!replay) {
        throw new NotFoundException('Aucun replay trouvé');
      }

      return replay.status;
    } catch (error) {
      console.error("Erreur lors de la récupération du replay :", error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('register_eventid/:confname')
  register_eventid(
    @Param('confname') confname: string,
    @Query('eventid') eventid: string,
    @Query('jwt') jwt: string,
    @Query('uploadcallbackurl') uploadCallbackUrl: string,
    @Query('uploadcallbackdomainurl') uploadCallbackDomainUrl: string,
  ) {
    if (
      !confname ||
      !eventid ||
      !jwt ||
      !uploadCallbackUrl ||
      !uploadCallbackDomainUrl
    ) {
      throw new HttpException(
        { message: 'Certains paramètres sont manquants.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!uploadCallbackUrl.startsWith('/')) {
      uploadCallbackUrl = '/' + uploadCallbackUrl;
    }

    uploadCallbackDomainUrl = uploadCallbackDomainUrl.replace('/', '');

    let exists = false;

    this.tab.forEach((e) => {
      if (e.confname === confname) {
        e.eventid = eventid;
        e.jwt = jwt;
        e.uploadCallbackUrl = uploadCallbackUrl;
        e.uploadCallbackDomainUrl = uploadCallbackDomainUrl;
        exists = true;
      }
    });

    if (!exists) {
      this.tab.push({
        confname,
        eventid,
        jwt,
        uploadCallbackUrl,
        uploadCallbackDomainUrl,
      });
    }

    console.log('tab from register_eventid:', this.tab);

    return {
      message: `L'eventid '${eventid}' est enregistré pour la conf '${confname}'`,
    };
  }
}
