import { Module } from '@nestjs/common';
import { CakesController } from './cakes.controller';
import { CakesService } from './cakes.service';
import { CakesRepository } from './cakes.repository';

@Module({
  controllers: [CakesController],
  providers: [CakesService, CakesRepository]
})
export class CakesModule {}
