import { Injectable } from '@nestjs/common';
import { CreateKaderDto } from './dto/create-kader.dto';
import { UpdateKaderDto } from './dto/update-kader.dto';

@Injectable()
export class KaderService {
  create(createKaderDto: CreateKaderDto) {
    return 'This action adds a new kader';
  }

  findAll() {
    return `This action returns all kader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kader`;
  }

  update(id: number, updateKaderDto: UpdateKaderDto) {
    return `This action updates a #${id} kader`;
  }

  remove(id: number) {
    return `This action removes a #${id} kader`;
  }
}
