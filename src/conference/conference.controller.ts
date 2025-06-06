import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBody, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';

import { IConferenceService } from './interfaces/conference-service.interface';
import { CreateConferenceDTO } from './DTOs/conference.dto';
import { ByEmailDTO } from './DTOs/byEmail.dto';
import { JwtDTO } from './DTOs/jwt.dto';

@ApiTags('Conferences')
@Controller('')
export class ConferenceController {
  constructor(
    @Inject(IConferenceService)
    private readonly conferenceService: IConferenceService,
  ) { }


  @Post('conferences')
  @ApiOkResponse({ description: 'Conférence créée avec succès' })
  async create(@Body() dto: CreateConferenceDTO) {
    return this.conferenceService.create(dto);
  }


  @Get('conferences')
  @ApiOkResponse({ description: 'Liste des conférences' })
  async findAll() {
    return this.conferenceService.findAll();
  }


  @Get('conferences/:id')
  @ApiOkResponse({ description: 'Conférence trouvée' })
  @ApiNotFoundResponse({ description: 'Conférence non trouvée' })
  async findOne(@Param('id') id: string) {
    return this.conferenceService.findOne(id);
  }


  @Delete('conferences/:id')
  @ApiOkResponse({ description: 'Conférence supprimée' })
  async delete(@Param('id') id: string) {
    return this.conferenceService.delete(id);
  }


  @Put('conferences/:id')
  @ApiOkResponse({ description: 'Conférence mise à jour' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateConferenceDTO>,
  ) {
    if ('update' in this.conferenceService) {
      return (this.conferenceService as any).update(id, body);
    }
    return { message: 'Mise à jour non supportée pour cette base.' };
  }


  @Get('roomExists/:roomName')
  @ApiOkResponse({ description: 'La salle existe' })
  @ApiNotFoundResponse({ description: "La salle n'existe pas" })
  async roomExists(@Param('roomName') roomName: string) {
    return this.conferenceService.roomExists(roomName);
  }


  @Get('/:roomName')
  @ApiOkResponse({ description: 'Token JWT renvoyé ou conférence déjà ouverte' })
  @ApiUnauthorizedResponse({ description: "Token requis ou non autorisé" })
  @ApiBearerAuth()
  async getRoomAccessToken(
    @Param('roomName') roomName: string,
    @Headers('webconf-user-region') region: string,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.split(' ')[1] ?? '';
    return this.conferenceService.getRoomAccessToken(roomName, region, token);
  }

  //send token by email 
  @Post('conference/create/byemail')
  @ApiOkResponse({ description: 'Email envoyé avec lien sécurisé' })
  @ApiUnauthorizedResponse({ description: "Email non autorisé (non whitelisté)" })
  @ApiBadRequestResponse({ description: "Erreur lors de l'envoi de l'email" })
  @ApiBody({ type: ByEmailDTO })
  async getRoomAccessTokenByEmail(
    @Body() dto: ByEmailDTO,
    @Req() req: Request,
  ) {
    const host = req.get('host') || 'localhost';
    return this.conferenceService.getRoomAccessTokenByEmail(dto, host);
  }

  // Check JWT token validity
  @Post('verify-token')
  @ApiOkResponse({ description: 'JWT vérifié avec succès' })
  @ApiUnauthorizedResponse({ description: 'JWT invalide ou expiré' })
  async verifyToken(@Body() dto: JwtDTO) {
    return this.conferenceService.verifyToken(dto.jwt);
  }
}
