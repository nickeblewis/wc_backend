import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from "fs/promises";
@Injectable()
export class CakesRepository {
    async findOne(id: number) {
        const content = await readFile('cakes.json', 'utf-8');
        const cakes = JSON.parse(content);
        return cakes.find((c: any) => c.id === id);
    }

    async findAll() {
        const content = await readFile('cakes.json', 'utf-8');
        const cakes = JSON.parse(content);
        return cakes;
    }

    async create(data: any) {
        const content = await readFile('cakes.json', 'utf-8');
        let cakes = JSON.parse(content);
        if (!Array.isArray(cakes)) {
            cakes = [];
        }
        const newCake = { ...data, id: Date.now() };
        cakes.push(newCake);
        await writeFile('cakes.json', JSON.stringify(cakes));
        return newCake;
    }

    async delete(id: number) {
        const content = await readFile('cakes.json', 'utf-8');
        const cakes = JSON.parse(content);
        const updatedCakes = cakes.filter((c: any) => c.id !== id);
        await writeFile('cakes.json', JSON.stringify(updatedCakes));
    }
}