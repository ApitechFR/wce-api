import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';
import { IFeedbackService } from '../interfaces/feedback-service.interface';
import { FeedbackDTO } from '../DTOs/feedback.dto';
import { mapDtoToFeedbackEntity } from '../utils/feedback.mapper';

@Injectable()
export class FeedbackServiceSQL implements IFeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private readonly feedbackRepo: Repository<Feedback>,
    ) { }

    async createFeedback(dto: FeedbackDTO, jmmcId: string, ip: string) {
        const feedbackData = mapDtoToFeedbackEntity(dto, ip, jmmcId);
        const entity = this.feedbackRepo.create(feedbackData);
        return this.feedbackRepo.save(entity);
    }

    async getAllFeedback() {
        return this.feedbackRepo.find();
    }

    async getFeedbackById(id: string) {
        return this.feedbackRepo.findOne({ where: { id: +id } });
    }

    async deleteFeedback(id: string) {
        await this.feedbackRepo.delete(+id);
    }
}
