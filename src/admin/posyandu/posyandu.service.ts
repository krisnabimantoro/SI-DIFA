import { Injectable } from '@nestjs/common';
import { CreatePosyanduDto } from './dto/create-posyandu.dto';
import { UpdatePosyanduDto } from './dto/update-posyandu.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PosyanduService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePosyanduDto, userId: string) {
    return this.prisma.posyandu.create({
      data: {
        nama_posyandu: data.nama_posyandu,
        alamat: data.alamat,
        no_telp: data.no_telp,
        created_at: new Date(),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all posyandu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} posyandu`;
  }

  update(id: number, updatePosyanduDto: UpdatePosyanduDto) {
    return `This action updates a #${id} posyandu`;
  }

  remove(id: number) {
    return `This action removes a #${id} posyandu`;
  }
}
