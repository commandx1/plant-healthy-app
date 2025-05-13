import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';

import { UploadController } from './upload.controller';

@Module({
    imports: [AwsModule],
    controllers: [UploadController]
})
export class UploadModule {}
