import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import cloudinary from '../../config/cloudinary.config';


@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  async uploadImage(file: Express.Multer.File) {
    try {

      if (!file) {
        throw new BadRequestException('File is missing');
      }

      this.logger.log(`Uploading file: ${file.originalname}`);
      
      console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);

      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'crm-employees',
      });

      this.logger.log(`Upload success: ${result.secure_url}`);

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };

    } catch (error) {

      this.logger.error('Cloudinary upload failed', error);

      throw error;
    }
  }
}