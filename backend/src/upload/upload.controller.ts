// src/upload/upload.controller.ts
import {
    Body,
    Controller,
    Delete,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly awsService: AwsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const imageUrl = await this.awsService.uploadFile(file);
        return { imageUrl };
    }

  @Delete('delete')
  async deleteFile(
    @Body('fileKey') fileKey: string,
  ): Promise<{ success: boolean }> {
      await this.awsService.deleteFile(fileKey);
      return { success: true };
  }
}
