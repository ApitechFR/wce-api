import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
// import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Feedbacks } from './entities/feedback.entity';
import { FeedbackServiceJoona } from './feedback.service.joona';

@Controller('rates')
export class FeedbackControllerJoona {
  constructor(private readonly feedbackService: FeedbackServiceJoona) { }

  // Create feedback
  @Post()
  async createFeedback(
    @Body() feedbackData: Partial<Feedbacks>,
  ): Promise<Feedbacks> {
    console.log("from controller : ", feedbackData)
    return this.feedbackService.createFeedback(feedbackData);
  }

  // Get all feedback
  @Get()
  async getAllFeedback(): Promise<Feedbacks[]> {
    return this.feedbackService.findAll();
  }

  // Get feedback by ID
  @Get(':id')
  async getFeedbackById(@Param('id') id: number): Promise<Feedbacks> {
    return this.feedbackService.findOne(id);
  }

  //delete feedback
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.feedbackService.delete(id);
  }
}
