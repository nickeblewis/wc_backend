import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CakesModule } from './cakes/cakes.module';

async function bootstrap() {
  const app = await NestFactory.create(CakesModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();