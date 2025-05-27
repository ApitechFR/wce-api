import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from '../schemas/Feedback.schema';
import { HttpModule } from '@nestjs/axios';
import { FeedbackControllerJoona } from './feedback.controller.joona';
import { FeedbackServiceJoona } from './feedback.service.joona';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbacks } from './entities/feedback.entity';

const isMongodb = process.env.DB_TYPE === 'mongodb';
const isGouv = process.env.IS_GOUV === 'true';

@Module({
  imports: [
    HttpModule,
    ...(isMongodb
      ? [
          MongooseModule.forFeature([
            {
              name: Feedback.name,
              schema: FeedbackSchema,
            },
          ]),
        ]
      : [TypeOrmModule.forFeature([Feedbacks])]),
  ],
  controllers: isGouv
    ? [FeedbackController]
    : [FeedbackControllerJoona],
  providers: isGouv
    ? [FeedbackService]
    : [FeedbackServiceJoona],
})
export class FeedbackModule {}
