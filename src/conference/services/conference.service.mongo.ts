import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WhiteListedDomains } from '../../schemas/WhiteListedDomains.schema';
import { CreateConferenceDTO } from '../DTOs/conference.dto';
import { ByEmailDTO } from '../DTOs/byEmail.dto';
import { IConferenceService } from '../interfaces/conference-service.interface';
import { ProsodyService } from '../../prosody/prosody.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConferenceServiceMongo implements IConferenceService {
    private readonly logger = new Logger(ConferenceServiceMongo.name);

    constructor(
        @InjectModel(WhiteListedDomains.name)
        private readonly whiteListedDomainsModel: Model<WhiteListedDomains>,
        private readonly prosodyService: ProsodyService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        if (!whiteListedDomainsModel) {
            throw new Error('WhiteListedDomainsModel is required in MongoDB mode.');
        }
    }

    //Méthodes obligatoires
    async create(data: CreateConferenceDTO): Promise<any> {
        return {
            message:
                "Méthode 'create' non utilisée avec MongoDB (ou à implémenter si besoin)",
            payload: data,
        };
    }

    async findAll(): Promise<any[]> {
        return [];
    }

    async findOne(id: string): Promise<any> {
        return null;
    }

    async delete(id: string): Promise<void> {
        this.logger.warn(`Suppression non applicable (id: ${id})`);
    }

    // Non applicable pour MongoDB
    update?(id: string, data: Partial<CreateConferenceDTO>): Promise<any> {
        throw new Error('Méthode non applicable en MongoDB');
    }

    async roomExists(roomName: string) {
        const exists = await this.prosodyService.roomExists(roomName);
        if (exists && exists.length > 0) {
            return { roomName };
        }
        this.logger.error("La conférence n'existe pas");
        throw new NotFoundException("La conférence n'existe pas");
    }

    async getRoomAccessToken(roomName: string, region: string, token: string) {
        const exists = await this.prosodyService.roomExists(roomName);
        if (exists && exists.length > 0) return { roomName };

        if (region.toLowerCase() !== 'internet') {
            return this.sendToken(roomName);
        }

        if (!token) {
            throw new UnauthorizedException(
                "Veuillez vous authentifier pour accéder à la webconf de l'État",
            );
        }

        this.verifyToken(token);
        return this.sendToken(roomName);
    }

    async getRoomAccessTokenByEmail(dto: ByEmailDTO, host: string) {
        const { email, roomName } = dto;
        const domain = email.split('@')[1];

        const domains = await this.whiteListedDomainsModel.find();
        const isAllowed = domains.some((entry) =>
            entry.domains.includes(domain),
        );

        if (!isAllowed) {
            throw new UnauthorizedException({ isWhitelisted: false });
        }

        const { jwt } = this.sendToken(roomName);
        const jwtLink = `https://${host}/${roomName}?jwt=${jwt}`;
        const guestLink = `https://${host}/${roomName}`;

        const html = fs.readFileSync(
            path.resolve(__dirname, '../../../templates/email-conference.html'),
            'utf-8',
        )
            .replace(/{{roomName}}/g, roomName)
            .replace(/{{jwtLink}}/g, jwtLink)
            .replace(/{{guestLink}}/g, guestLink)
            .replace(/{{expire}}/g, this.configService.get('JITSI_JITSIJWT_EXPIRESAFTER'));

        await this.mailerService.sendMail({
            from: this.configService.get('EMAIL_FROM'),
            to: email,
            subject: this.configService.get('EMAIL_SUBJECT') + roomName,
            html,
        });

        return { isWhitelisted: true, sended: 'email sended' };
    }

    async verifyToken(jwt: string) {
        try {
            return this.jwtService.verify(jwt);
        } catch (error) {
            this.logger.error("Le token d'accès est expiré");
            throw new UnauthorizedException("L'accessToken est expiré");
        }
    }

    private sendToken(roomName: string) {
        const jwt = this.jwtService.sign({
            iss: this.configService.get('JITSI_JITSIJWT_ISS'),
            exp: moment()
                .add(this.configService.get('JITSI_JITSIJWT_EXPIRESAFTER'), 'hours')
                .unix(),
            aud: this.configService.get('JITSI_JITSIJWT_AUD'),
            sub: this.configService.get('JITSI_JITSIJWT_SUB'),
            room: roomName,
        });

        return { roomName, jwt };
    }
}
