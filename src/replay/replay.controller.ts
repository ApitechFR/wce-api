import { Body, Controller, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ReplayService } from './replay.service';
import { CreateReplayDto, UpdateReplayDto } from './DTOs/replay.dto';
import { Replay } from './entities/replay.entity';

@Controller('api/visioreplay')
export class ReplayController {
  constructor(private readonly replayService: ReplayService) { }

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
}
