import { Injectable } from '@nestjs/common';
import { CreatePresensiKaderDto } from './dto/create-presensi-kader.dto';
import { UpdatePresensiKaderDto } from './dto/update-presensi-kader.dto';

@Injectable()
export class PresensiKaderService {
  create(createPresensiKaderDto: CreatePresensiKaderDto) {
    return 'This action adds a new presensiKader';
  }

  findAll() {
    return `This action returns all presensiKader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presensiKader`;
  }

  update(id: number, updatePresensiKaderDto: UpdatePresensiKaderDto) {
    return `This action updates a #${id} presensiKader`;
  }

  remove(id: number) {
    return `This action removes a #${id} presensiKader`;
  }
}
