import { Controller, Get, Post, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { CreateCakeDto } from './dtos/create-cake.dto';
import { CakesService } from './cakes.service';

@Controller('cakes')
export class CakesController {
  constructor(public cakesService: CakesService) {}

  @Get()
  listCakes() {
    return this.cakesService.findAll();
  }

  @Post()
  createCake(@Body() body: CreateCakeDto) {
    return this.cakesService.create(body);
  }

  @Get('/:id')
  async getCake(@Param('id') id: string) {
    const message = await this.cakesService.findOne(parseInt(id));
    if (!message) {
      throw new NotFoundException('Cake not found');
    }
    return message;
  }

  @Delete('/:id')
  async deleteCake(@Param('id') id: string) {
    await this.cakesService.delete(parseInt(id));
    return { message: 'Cake deleted successfully' };
  }
}
