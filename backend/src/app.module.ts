import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { LocationModule } from './location/location.module';
import { PlantModule } from './plant/plant.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        UserModule,
        AuthModule,
        UploadModule,
        AwsModule,
        LocationModule,
        PlantModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
