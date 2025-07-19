import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { InformasiEdukasiDto } from 'src/dto/informasi-edukasi';
import { LowonganDto } from 'src/dto/lowongan';

import { Prisma, lowongan } from '@prisma/client';
@Injectable()
export class LowonganService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: LowonganDto,
    userId: string,
    fileName: string,
  ): Promise<lowongan> {
    return this.prismaService.lowongan.create({
      data: {
        nama_lowongan: data.nama_lowongan,
        nama_perusahaan: data.nama_perusahaan,
        jenis_pekerjaan: data.jenis_pekerjaan,
        lokasi: data.lokasi,
        jenis_difasilitas: data.jenis_difasilitas,
        deskripsi: data.deskripsi,
        file_name: fileName,
        status: data.status,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
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
      cursor?: Prisma.lowonganWhereUniqueInput;
      where?: Prisma.lowonganWhereInput;
      orderBy?: Prisma.lowonganOrderByWithRelationInput;
      page?: number;
    } = {},
  ): Promise<{
    data: lowongan[];
    meta: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      limit: number;
    };
  }> {
    const { skip, take = 10, where, orderBy } = params;

    const [dataLowongan, totalData] = await Promise.all([
      this.prismaService.lowongan.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      this.prismaService.lowongan.count({
        where,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataLowongan,
      meta: {
        totalData,
        totalPage,
        currentPage: params.page || 1,
        limit: take,
      },
    };
  }
  async findOne(
    where: Prisma.lowonganWhereUniqueInput,
  ): Promise<lowongan | null> {
    return this.prismaService.lowongan.findUnique({
      where,
    });
  }
  async update(
    where: Prisma.lowonganWhereUniqueInput,
    data: LowonganDto,
    userId: string,
    file_name?: string,
  ): Promise<lowongan> {
    return this.prismaService.lowongan.update({
      where,
      data: {
        nama_lowongan: data.nama_lowongan,
        nama_perusahaan: data.nama_perusahaan,
        jenis_pekerjaan: data.jenis_pekerjaan,
        lokasi: data.lokasi,
        jenis_difasilitas: data.jenis_difasilitas,
        deskripsi: data.deskripsi,
        file_name: file_name || undefined, // Optional file name
        status: data.status,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        updated_at: new Date(),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async delete(where: Prisma.lowonganWhereUniqueInput): Promise<lowongan> {
    return this.prismaService.lowongan.delete({
      where,
    });
  }
}
