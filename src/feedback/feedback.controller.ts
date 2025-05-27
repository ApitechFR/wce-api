import { Controller, Post, Req, Body, BadRequestException, Inject, Headers } from '@nestjs/common';
import { Request } from 'express';
import { FeedbackDTO } from './DTOs/feedback.dto';
import { IFeedbackService } from './interfaces/feedback-service.interface';
import { Param, Get, Delete } from '@nestjs/common';

@Controller('feedback')
export class FeedbackController {
  constructor(
    @Inject(IFeedbackService)
    private readonly feedbackService: IFeedbackService,
  ) { }

  @Post()
  async createFeedback(
    @Req() req: Request,
    @Body() body: FeedbackDTO,
    @Headers('webconf-user-region') fromInternetHeader: string,
  ) {
    const ip = req.ip;
    const jmmcId = req.signedCookies?.['jmmc_objectId'];
    const isFromInternet = fromInternetHeader?.toLowerCase() === 'internet';
    const userAgent = req.headers['user-agent'];

    if (!this.isSourceValid(body.isVPN, isFromInternet)) {
      throw new BadRequestException('Veuillez vérifier les informations envoyées');
    }


    return this.feedbackService.createFeedback(body, jmmcId, ip, userAgent);
  }


  @Get()
  async getAll() {
    return this.feedbackService.getAllFeedback();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.feedbackService.getFeedbackById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.feedbackService.deleteFeedback(id);
  }

  private isSourceValid(isVPN: number, fromInternet: boolean): boolean {
    return (isVPN === -1 && fromInternet) || ((isVPN === 0 || isVPN === 1) && !fromInternet);
  }


}
