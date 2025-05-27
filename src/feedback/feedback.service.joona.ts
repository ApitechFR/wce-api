import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedbacks } from './entities/feedback.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackServiceJoona {
  constructor(
    @InjectRepository(Feedbacks)
    private readonly feedbackRepository: Repository<Feedbacks>,
  ) {}

  // Create feedback
  async createFeedback(feedbackData: Partial<Feedbacks>): Promise<Feedbacks> {
    try {
      console.log({feedbackData})
      const feedback = this.feedbackRepository.create(feedbackData);
      return this.feedbackRepository.save(feedback);
    } catch (error) {
      throw new InternalServerErrorException('cannot create feedback');
    }
  }

  // Get all feedback
  async findAll(): Promise<Feedbacks[]> {
    try {
      return this.feedbackRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('cannot find feedbacks');
    }
  }

  // Get feedback by ID
  async findOne(id: number): Promise<Feedbacks> {
    try {
      const feedback = await this.feedbackRepository.findOne({ where: { id } });
      if (!feedback) {
        throw new NotFoundException('Feedback not found');
      }
      return feedback;
    } catch (error) {
      throw new NotFoundException('Cannot find feedback');
    }
  }

  //Delete User
  async delete(id: number): Promise<void> {
    try {
      await this.feedbackRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete feedback');
    }
  }
}
