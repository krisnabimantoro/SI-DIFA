import { Injectable } from '@nestjs/common';
import { CreatePresensiIbkDto } from './dto/create-presensi-ibk.dto';
import { UpdatePresensiIbkDto } from './dto/update-presensi-ibk.dto';

@Injectable()
export class PresensiIbkService {
  create(createPresensiIbkDto: CreatePresensiIbkDto) {
    return 'This action adds a new presensiIbk';
  }

  findAll() {
    return `This action returns all presensiIbk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presensiIbk`;
  }

  update(id: number, updatePresensiIbkDto: UpdatePresensiIbkDto) {
    return `This action updates a #${id} presensiIbk`;
  }

  remove(id: number) {
    return `This action removes a #${id} presensiIbk`;
  }
}
