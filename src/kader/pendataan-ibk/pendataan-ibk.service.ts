import { Injectable } from '@nestjs/common';
import { CreatePendataanIbkDto } from './dto/create-pendataan-ibk.dto';
import { UpdatePendataanIbkDto } from './dto/update-pendataan-ibk.dto';

@Injectable()
export class PendataanIbkService {
  create(createPendataanIbkDto: CreatePendataanIbkDto) {
    return 'This action adds a new pendataanIbk';
  }

  findAll() {
    return `This action returns all pendataanIbk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pendataanIbk`;
  }

  update(id: number, updatePendataanIbkDto: UpdatePendataanIbkDto) {
    return `This action updates a #${id} pendataanIbk`;
  }

  remove(id: number) {
    return `This action removes a #${id} pendataanIbk`;
  }
}
