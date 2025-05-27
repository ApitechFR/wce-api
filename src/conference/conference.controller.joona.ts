import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ConferenceServiceJoona } from './conference.service.joona';
import { Conference } from './entities/conference.entity';

@Controller('conferences')
export class ConferenceControllerJoona {
  constructor(private readonly conferenceService: ConferenceServiceJoona) { }

  // Create conference
  @Post()
  async createConference(
    @Body() conferenceData: Partial<Conference>,
  ): Promise<Conference> {
    return this.conferenceService.createConference(conferenceData);
  }

  // Get all conference
  @Get()
  async getAllConference(): Promise<Conference[]> {
    return this.conferenceService.findAll();
  }

  // Get conference by ID
  @Get(':id')
  async getConferenceById(@Param('id') id: number): Promise<Conference> {
    return this.conferenceService.findOne(id);
  }

  //Update conference
  @Put(":id")
  async update(@Param("id") id: number, @Body() userData: Partial<Conference>): Promise<Conference> {
    return this.conferenceService.update(id, userData);
  }

  //delete conference
  @Delete(":id")
  async delete(@Param("id") id: number): Promise<void> {
    return this.conferenceService.delete(id);
  }
}
