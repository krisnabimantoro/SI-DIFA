import { Injectable } from '@nestjs/common';

import { Prisma, informasi_edukasi } from '@prisma/client';
import { InformasiEdukasiDto } from 'src/dto/informasi-edukasi';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InformasiEdukasiService {
  constructor(private prisma: PrismaService) {}

  async createInformasiEdukasi(
    data: InformasiEdukasiDto,
    userId: string,
    fileName?: string,
  ): Promise<informasi_edukasi> {
    return this.prisma.informasi_edukasi.create({
      data: {
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file_name: fileName,
        created_at: new Date(),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async getCountTipeInformasiEdukasi(): Promise<any> {
    const count = await this.prisma.informasi_edukasi.count();

    const countPanduan = await this.prisma.informasi_edukasi.count({
      where: {
        tipe: 'PANDUAN',
      },
    });
    const countArtikel = await this.prisma.informasi_edukasi.count({
      where: {
        tipe: 'ARTIKEL',
      },
    });
    const countRegulasi = await this.prisma.informasi_edukasi.count({
      where: {
        tipe: 'REGULASI',
      },
    });

    return {
      total: count,
      panduan: countPanduan,
      artikel: countArtikel,
      regulasi: countRegulasi,
    };
  }

  async updateInformasiEdukasi(
    where: Prisma.informasi_edukasiWhereUniqueInput,
    data: InformasiEdukasiDto,
    userId: string,
    fileName?: string,
  ): Promise<informasi_edukasi> {
    return this.prisma.informasi_edukasi.update({
      where,
      data: {
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file_name: fileName,
        updated_at: new Date(),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async getFilePathInformasi(
    where: Prisma.informasi_edukasiWhereUniqueInput,
  ): Promise<string | null> {
    const informasi = await this.prisma.informasi_edukasi.findUnique({
      where,
      select: { file_name: true },
    });
    return informasi?.file_name || null;
  }

  async getInformasiEdukasi(
    where: Prisma.informasi_edukasiWhereUniqueInput,
  ): Promise<informasi_edukasi | null> {
    return this.prisma.informasi_edukasi.findUnique({
      where,
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
      // filter: { [key: string]: any };
    } = {
      // filter: {}
    },
  ): Promise<{
    data: informasi_edukasi[];
    meta: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      limit: number;
    };
  }> {
    // const { filter } = params;

    const { skip, take = 10, cursor, where, orderBy } = params;
    const dataInformasi = await this.prisma.informasi_edukasi.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const totalData = await this.prisma.informasi_edukasi.count({
      where,
    });

    const totalPage = Math.ceil(totalData / (take || 10));
    return {
      data: dataInformasi,
      meta: {
        totalData: totalData,
        totalPage: totalPage,
        currentPage: skip ? Math.ceil(skip / take) + 1 : 1,
        limit: take || 10,
      },
    };
  }
}
