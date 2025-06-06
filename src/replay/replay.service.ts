import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Replay } from './entities/replay.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateReplayDto, UpdateReplayDto } from './DTOs/replay.dto';

@Injectable()
export class ReplayService {
    constructor(
        @InjectRepository(Replay)
        private readonly replayRepository: Repository<Replay>,
    ) { }

    async createReplay(data: CreateReplayDto): Promise<Replay> {
        try {
            const replay = this.replayRepository.create({
                status: data.status,
                message: data.message,
                conference_name: data.conference_name,
                conference_uid: uuidv4(),
            });

            return await this.replayRepository.save(replay);
        } catch (error) {
            console.error('Error inserting replay:', error);
            throw error;
        }
    }

    async updateReplayByConfName(conference_name: string, data: UpdateReplayDto): Promise<Replay> {
        try {
            const replay = await this.replayRepository.findOne({
                where: {
                    status: 'started',
                    uid: null,
                    conference_name: conference_name,
                },
                order: {
                    created_at: 'DESC',
                },
            });

            if (!replay) {
                throw new NotFoundException('Replay not found for this conference.');
            }

            replay.uid = data.uid;
            replay.file_path = data.file_path ?? replay.file_path;
            replay.status = data.status;
            replay.message = data.message;

            return await this.replayRepository.save(replay);
        } catch (error) {
            console.error('Replay non trouvé ou erreur lors de la mise à jour', error);
            throw error;
        }
    }
}
