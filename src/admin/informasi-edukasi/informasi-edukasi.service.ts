import { Injectable } from '@nestjs/common';

import { Prisma, informasi_edukasi } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InformasiEdukasiService {
  constructor(private prisma: PrismaService) {}

  async createInformasiEdukasi(
    data: Prisma.informasi_edukasiCreateInput,
  ): Promise<informasi_edukasi> {
    return this.prisma.informasi_edukasi.create({
      data,
    });
  }

  async getInformasiEdukasi(
    where: Prisma.informasi_edukasiWhereUniqueInput,
  ): Promise<informasi_edukasi | null> {
    return this.prisma.informasi_edukasi.findUnique({
      where,
    });
  }

  async updateInformasiEdukasi(
    where: Prisma.informasi_edukasiWhereUniqueInput,
    data: Prisma.informasi_edukasiUpdateInput,
  ): Promise<informasi_edukasi> {
    return this.prisma.informasi_edukasi.update({
      where,
      data,
    });
  }

  async deleteInformasiEdukasi(
    where: Prisma.informasi_edukasiWhereUniqueInput,
  ): Promise<informasi_edukasi> {
    return this.prisma.informasi_edukasi.delete({
      where,
    });
  }

  async getAllInformasiEdukasi(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.informasi_edukasiWhereUniqueInput;
      where?: Prisma.informasi_edukasiWhereInput;
      orderBy?: Prisma.informasi_edukasiOrderByWithRelationInput;
    } = {},
  ): Promise<informasi_edukasi[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.informasi_edukasi.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
