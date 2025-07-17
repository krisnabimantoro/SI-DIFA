import { Injectable, NotFoundException } from '@nestjs/common';
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
      page?: number;
    } = {},
  ): Promise<{
    data: posyandu[];
    meta: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      limit: number;
    };
  }> {
    const { skip, take = 10, where, orderBy, page = 1 } = params;


    const [dataPosyandu, totalData] = await Promise.all([
      this.prisma.posyandu.findMany({
        skip, 
        take,
        where,
        orderBy,
      }),
      this.prisma.posyandu.count({
        where,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataPosyandu,
      meta: {
        totalData,
        totalPage,
        currentPage: page,
        limit: take,
      },
    };
  }

  async findOne(where: Prisma.posyanduWhereUniqueInput): Promise<posyandu> {
    const posyandu = await this.prisma.posyandu.findUnique({ where });

    if (!posyandu) {
      throw new NotFoundException(`Posyandu not found`);
    }

    return posyandu;
  }

  update(updatePosyanduDto: UpdatePosyanduDto) {
    return this.prisma.posyandu.update({
      where: { id: updatePosyanduDto.id },
      data: updatePosyanduDto,
    });
  }

  async remove(where: Prisma.posyanduWhereUniqueInput) {
    await this.prisma.posyandu.delete({
      where,
    });
    return { message: 'Posyandu deleted successfully' };
  }
}
