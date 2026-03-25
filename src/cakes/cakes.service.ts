import { Injectable } from "@nestjs/common";
import { CakesRepository } from "./cakes.repository";
@Injectable()
export class CakesService {
  constructor(public cakesRepository: CakesRepository) {}
  
  findAll() {
    return this.cakesRepository.findAll();
  }

  create(data: any) {
    return this.cakesRepository.create(data);
  }

  findOne(id: number) {
    return this.cakesRepository.findOne(id);
  }

  delete(id: number) {
    return this.cakesRepository.delete(id);
  }
}