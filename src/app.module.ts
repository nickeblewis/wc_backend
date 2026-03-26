import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CakesModule } from './cakes/cakes.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CakesModule,
    UploadModule,
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/uploads',
      },
      {
        rootPath: join(__dirname, '..', 'client', 'dist'),
      },
    ),
  ],
})
export class AppModule {}
