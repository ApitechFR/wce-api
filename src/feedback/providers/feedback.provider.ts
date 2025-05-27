import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedbackServiceMongo } from '../services/feedback.service.mongo';
import { FeedbackServiceSQL } from '../services/feedback.service.sql';
import { IFeedbackService } from '../interfaces/feedback-service.interface';

export const FeedbackServiceProvider: Provider = {
    provide: IFeedbackService,
    useFactory: (
        configService: ConfigService,
        feedbackMongo: FeedbackServiceMongo,
        feedbackSQL: FeedbackServiceSQL,
    ): IFeedbackService => {
        const dbType = configService.get<string>('DB_TYPE');
        if (dbType === 'mongodb') return feedbackMongo;
        if (dbType === 'mariadb') return feedbackSQL;
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    },
    inject: [ConfigService, FeedbackServiceMongo, FeedbackServiceSQL],
};
