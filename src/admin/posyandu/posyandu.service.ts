import { Injectable } from '@nestjs/common';
import { CreatePosyanduDto } from './dto/create-posyandu.dto';
import { UpdatePosyanduDto } from './dto/update-posyandu.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, posyandu } from '@prisma/client';

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

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.posyanduWhereUniqueInput;
      where?: Prisma.posyanduWhereInput;
      orderBy?: Prisma.posyanduOrderByWithRelationInput;
    } = {},
  ): Promise<{
    data: posyandu[];
    meta: { count: number; currentPage: number; limit: number };
  }> {
    const { skip, take, cursor, where, orderBy } = params;
    const dataPosyandu = await this.prisma.posyandu.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return {
      data: dataPosyandu,
      meta: {
        count: dataPosyandu.length,
        currentPage: skip || 1,
        limit: take || 10,
      },
    };
  }

  findOne(where: Prisma.posyanduWhereUniqueInput): Promise<posyandu | null> {
    return this.prisma.posyandu.findUnique({
      where,
    });
  }

  update(updatePosyanduDto: UpdatePosyanduDto) {
    return this.prisma.posyandu.update({
      where: { id: updatePosyanduDto.id },
      data: updatePosyanduDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} posyandu`;
  }
}
