import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!file) return '';

        const fileKey = `uploads/${uuid()}`;

        const uploadResult = await this.s3
            .upload({
                Bucket: process.env.AWS_S3_BUCKET!,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
            .promise();

        const publicUrl = uploadResult.Location;

        return publicUrl;
    }

    async deleteFile(fileKey: string): Promise<void> {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: fileKey,
        };

        await this.s3.deleteObject(params).promise();
    }
}
