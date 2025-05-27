import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback as FeedbackEntity } from './entities/feedback.entity';
import { Feedback as FeedbackMongo, FeedbackSchema } from './schemas/Feedback.schema';
import { FeedbackController } from './feedback.controller';
import { FeedbackServiceMongo } from './services/feedback.service.mongo';
import { FeedbackServiceSQL } from './services/feedback.service.sql';
import { FeedbackServiceProvider } from './providers/feedback.provider';
import { IFeedbackService } from './interfaces/feedback-service.interface';
import { getMongoFeatureFor } from './utils/mongo-feature.util';


@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([FeedbackEntity]),
    ...getMongoFeatureFor(FeedbackMongo.name, FeedbackSchema),
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackServiceMongo,
    FeedbackServiceSQL,
    FeedbackServiceProvider,
  ],
  exports: [IFeedbackService],
})
export class FeedbackModule { }

