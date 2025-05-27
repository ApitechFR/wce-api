import { CreateConferenceDTO } from '../DTOs/conference.dto';
import { ByEmailDTO } from '../DTOs/byEmail.dto';

export const IConferenceService = Symbol('IConferenceService');

export interface IConferenceService<T = any> {
    create(data: CreateConferenceDTO): Promise<T>;
    findAll(): Promise<T[]>;
    findOne(id: string): Promise<T | null>;
    delete(id: string): Promise<void>;

    update?(id: string, data: Partial<CreateConferenceDTO>): Promise<T>;

    roomExists(roomName: string): Promise<{ roomName: string }>;
    getRoomAccessToken(roomName: string, region: string, token: string): Promise<{ roomName: string; jwt?: string }>;
    getRoomAccessTokenByEmail(dto: ByEmailDTO, host: string): Promise<any>;
    verifyToken(jwt: string): Promise<any>;
}
