import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const createMongooseConfig = async (
    configService: ConfigService,
): Promise<MongooseModuleOptions> => {
    const uri = configService.get<string>('MONGO_URI');
    if (!uri?.startsWith('mongodb://') && !uri?.startsWith('mongodb+srv://')) {
        throw new Error(`[Mongoose] Invalid MONGO_URI: ${uri}`);
    }

    return { uri };
};
