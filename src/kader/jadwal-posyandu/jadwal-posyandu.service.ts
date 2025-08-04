import { Injectable } from '@nestjs/common';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';
import { PrismaService } from 'src/prisma.service';

import { Prisma, jadwal_posyandu, posyandu } from '@prisma/client';

@Injectable()
export class JadwalPosyanduService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    posyanduId: string,
    createJadwalPosyanduDto: CreateJadwalPosyanduDto,
  ): Promise<jadwal_posyandu> {
    // Remove posyandu_id from DTO to avoid conflict with relation
    const { posyandu_id, ...dataJadwalPosyandu } = createJadwalPosyanduDto;
    return this.prismaService.jadwal_posyandu.create({
      data: {
        posyandu: {
          connect: { id: posyanduId },
        },
        ...dataJadwalPosyandu,
        created_at: new Date(),
      },
    });
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
