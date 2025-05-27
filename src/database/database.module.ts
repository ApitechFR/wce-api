import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createMongooseConfig } from './factories/mongoose.factory';
import { createTypeOrmConfig } from './factories/typeorm.factory';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const imports: DynamicModule['imports'] = [ConfigModule];

    const tempConfig = new ConfigService();
    const dbType = tempConfig.get<string>('DB_TYPE');

    if (dbType === 'mongodb') {
      imports.push(
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: createMongooseConfig,
        }),
      );
    }

    if (dbType === 'mariadb') {
      imports.push(
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: createTypeOrmConfig,
        }),
      );
    }

    return {
      module: DatabaseModule,
      imports,
    };
  }
}
