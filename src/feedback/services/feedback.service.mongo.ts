import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
    Optional,
} from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';

import { Feedback as FeedbackSchemaType } from '../schemas/Feedback.schema';
import { FeedbackDTO } from '../DTOs/feedback.dto';
import { IFeedbackService } from '../interfaces/feedback-service.interface';
import { mapDtoToFeedbackEntity } from '../utils/feedback.mapper';

type FeedbackDocument = FeedbackSchemaType & Document;

@Injectable()
export class FeedbackServiceMongo implements IFeedbackService<FeedbackDocument> {
    private readonly logger = new Logger(FeedbackServiceMongo.name);

    constructor(
        @Optional()
        @InjectModel(FeedbackSchemaType.name)
        private readonly feedbackModel: Model<FeedbackDocument>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        if (!this.feedbackModel) {
            this.logger.warn(
                '[FeedbackServiceMongo] Le modèle Mongoose Feedback est indisponible (MongoDB désactivé ?)',
            );
        }
    }

    async createFeedback(dto: FeedbackDTO, jmmcId: string, ip: string) {
        if (!this.feedbackModel) throw new Error('FeedbackModel is not available');

        const { data } = await firstValueFrom(
            this.httpService
                .get(`${this.configService.get('JMMC_URL')}/objectId?jmmc_id=${jmmcId}`)
                .pipe(
                    catchError(() => {
                        this.logger.error('Le serveur JMMC ne répond pas');
                        throw new NotFoundException('Erreur lors de la recherche JMMC');
                    }),
                ),
        );

        const alreadyExists = await this.feedbackModel.findOne({ jmmc_id: jmmcId });

        if (alreadyExists) {
            throw new BadRequestException('Feedback déjà soumis pour cette session');
        }

        const feedbackData = mapDtoToFeedbackEntity(dto, ip, jmmcId);
        const feedback = new this.feedbackModel(feedbackData);
        return feedback.save();
    }

    async getAllFeedback() {
        if (!this.feedbackModel) throw new Error('FeedbackModel is not available');
        return this.feedbackModel.find().exec();
    }

    async getFeedbackById(id: string) {
        if (!this.feedbackModel) throw new Error('FeedbackModel is not available');
        return this.feedbackModel.findById(id).exec();
    }

    async deleteFeedback(id: string) {
        if (!this.feedbackModel) throw new Error('FeedbackModel is not available');
        await this.feedbackModel.findByIdAndDelete(id).exec();
    }
}
