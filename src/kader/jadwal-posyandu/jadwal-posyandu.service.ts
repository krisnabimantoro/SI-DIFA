import { Injectable } from '@nestjs/common';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';

@Injectable()
export class JadwalPosyanduService {
  create(createJadwalPosyanduDto: CreateJadwalPosyanduDto) {
    return 'This action adds a new jadwalPosyandu';
  }

  findAll() {
    return `This action returns all jadwalPosyandu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jadwalPosyandu`;
  }

  update(id: number, updateJadwalPosyanduDto: UpdateJadwalPosyanduDto) {
    return `This action updates a #${id} jadwalPosyandu`;
  }

  remove(id: number) {
    return `This action removes a #${id} jadwalPosyandu`;
  }
}
