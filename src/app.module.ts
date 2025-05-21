import { configValidationSchema } from './config.schema';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConferenceModule } from './conference/conference.module';
import { StatsModule } from './stats/stats.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeedbackModule } from './feedback/feedback.module';
import { ProsodyModule } from './prosody/prosody.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { databaseProvider } from './database/database.provider';

@Module({

})
export class AppModule {
  static async register (): Promise <DynamicModule> {

    const configService = new ConfigService();
    const database = databaseProvider(configService);

    return {
      module : AppModule,
      imports: [
        ConfigModule, 
        database,
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              transport: {
                pool: configService.get('EMAIL_SMTP_POOL'),
                host: configService.get('EMAIL_SMTP_HOST'),
                port: configService.get('EMAIL_SMTP_PORT'),
                secure: configService.get('EMAIL_SMTP_SECURE') === 'true',
                auth: {
                  user: configService.get('EMAIL_SMTP_AUTH_USER'),
                  pass: configService.get('EMAIL_SMTP_AUTH_PASS'),
                },
                tls: {
                  rejectUnauthorized:
                    configService.get('EMAIL_SMTP_TLS_REJECTUNAUTHORIZED') ===
                    'true',
                },
              },
              defaults: {
                from: '"nest-modules" <modules@nestjs.com>',
              },
            };
          },
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return { secret: configService.get('JITSI_JITSIJWT_SECRET') };
          },
          global: true,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
          validationSchema: configValidationSchema,
        }),
        AuthenticationModule,
        ConferenceModule,
        StatsModule,
        FeedbackModule,
        ProsodyModule,
      ],   
      controllers: [AppController],
      providers: [AppService],
    }
  }
}