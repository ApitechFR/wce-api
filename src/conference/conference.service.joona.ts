import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conference } from './entities/conference.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConferenceServiceJoona {
    constructor(
            @InjectRepository(Conference)
            private conferenceRepository: Repository<Conference>
        ) {}
    
        // Create conference
        async createConference(conferenceData: Partial<Conference>): Promise<Conference> {
            try {
                const conference = this.conferenceRepository.create(conferenceData);
                return this.conferenceRepository.save(conference);
            } catch (error) {
                throw new InternalServerErrorException('cannot create conference');
            }
        }
    
        // Get all conferences
        async findAll(): Promise<Conference[]> {
            try {
                return this.conferenceRepository.find();
            } catch (error) {
                throw new InternalServerErrorException('cannot find conferences');
            }
        }
    
        // Get conference by ID
        async findOne(id: number): Promise<Conference> {
            try {
                const conference = await this.conferenceRepository.findOne({ where: { id } });
                if (!conference) {
                    throw new NotFoundException('Conference not found');
                }
                return conference;
            } catch (error) {
                throw new InternalServerErrorException('Cannot find conference');
            }
        }
    
        //Update conference
        async update(id: number, conferenceData: Partial<Conference>): Promise<Conference> {
            try {
                await this.conferenceRepository.update(id, conferenceData);
                return this.conferenceRepository.findOne({ where: { id } });
            } catch (error) {
                throw new InternalServerErrorException('Cannot update conference');
            }
        }
        
        //Delete conference
        async delete(id: number): Promise<void> {
            try {
                await this.conferenceRepository.delete(id);
            } catch (error) {
                throw new InternalServerErrorException('Cannot delete conference');
            }
        }
}
