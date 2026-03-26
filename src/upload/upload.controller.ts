import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('filepond', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        cb(null, file.mimetype.startsWith('image/'));
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }
}
