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

    // Create the jadwal_posyandu first
    const createdJadwal = await this.prismaService.jadwal_posyandu.create({
      data: {
        posyandu: {
          connect: { id: posyanduId },
        },
        ...dataJadwalPosyandu,
        created_at: new Date(),
      },
    });

    // Get all IBK users associated with this posyandu
    const ibkUsers = await this.prismaService.ibk.findMany({
      where: {
        posyanduId: posyanduId,
      },
      select: {
        id: true,
      },
    });

    // Create bulk presensi_ibk records for all IBK users
    if (ibkUsers.length > 0) {
      const presensiIbkData = ibkUsers.map((ibk) => ({
        user_ibk_id: ibk.id,
        jadwal_id: createdJadwal.id,
        status_presensi: 'BELUM_HADIR',
        created_at: new Date(),
      }));

      await this.prismaService.presensi_ibk.createMany({
        data: presensiIbkData,
      });
    }

    return createdJadwal;
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.jadwal_posyanduWhereUniqueInput;
      where?: Prisma.jadwal_posyanduWhereInput;
      orderBy?: Prisma.jadwal_posyanduOrderByWithRelationInput;
      posyanduId?: string;
    } = {},
  ): Promise<{
    data: Prisma.jadwal_posyanduGetPayload<{
      select: {
        id: true;
        nama_kegiatan: true;
        lokasi: true;
        tanggal: true;
        waktu_mulai: true;
        waktu_selesai: true;
        created_at: true;
      };
    }>[];
    meta: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      limit: number;
    };
  }> {
    const { skip, take = 10, where, orderBy, posyanduId } = params;

    // Build where condition with posyanduId filter
    const whereCondition = {
      ...where,
      ...(posyanduId && { posyandu_id: posyanduId }),
    };

    const [dataJadwal, totalData] = await Promise.all([
      this.prismaService.jadwal_posyandu.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy,
        select: {
          id: true,
          nama_kegiatan: true,
          lokasi: true,
          tanggal: true,
          waktu_mulai: true,
          waktu_selesai: true,
          created_at: true,
        },
      }),
      this.prismaService.jadwal_posyandu.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataJadwal,
      meta: {
        totalData,
        totalPage,
        currentPage: skip ? Math.floor(skip / take) + 1 : 1,
        limit: take,
      },
    };
  }

  async findOne(
    where: Prisma.jadwal_posyanduWhereUniqueInput,
  ): Promise<jadwal_posyandu | null> {
    return this.prismaService.jadwal_posyandu.findUnique({
      where,
      include: {
        posyandu: {
          select: {
            id: true,
            nama_posyandu: true,
            alamat: true,
          },
        },
      },
    });
  }

  async update(
    where: Prisma.jadwal_posyanduWhereUniqueInput,
    updateJadwalPosyanduDto: UpdateJadwalPosyanduDto,
    fileName?: string,
  ): Promise<jadwal_posyandu> {
    const { posyandu_id, ...dataJadwalPosyandu } = updateJadwalPosyanduDto;

    return this.prismaService.jadwal_posyandu.update({
      where,
      data: {
        ...dataJadwalPosyandu,
        ...(fileName && { file_name: fileName }),
        updated_at: new Date(),
        ...(posyandu_id && {
          posyandu: {
            connect: { id: posyandu_id },
          },
        }),
      },
    });
  }

  async remove(
    where: Prisma.jadwal_posyanduWhereUniqueInput,
  ): Promise<jadwal_posyandu> {
    try {
      // Get existing jadwal with related data
      const existingJadwal =
        await this.prismaService.jadwal_posyandu.findUnique({
          where,
          include: {
            presensi_kader: true,
            presensi_ibk: true,
            monitoring_ibk: true,
          },
        });

      if (!existingJadwal) {
        throw new Error('Jadwal posyandu not found');
      }

      // Delete related records first (due to foreign key constraints)

      // Delete presensi_kader records
      if (existingJadwal.presensi_kader.length > 0) {
        await this.prismaService.presensi_kader.deleteMany({
          where: { jadwal_id: existingJadwal.id },
        });
      }

      // Delete presensi_ibk records
      if (existingJadwal.presensi_ibk.length > 0) {
        await this.prismaService.presensi_ibk.deleteMany({
          where: { jadwal_id: existingJadwal.id },
        });
      }

      // Delete monitoring_ibk records
      if (existingJadwal.monitoring_ibk.length > 0) {
        await this.prismaService.monitoring_ibk.deleteMany({
          where: { jadwal_posyandu_id: existingJadwal.id },
        });
      }

      // Delete main jadwal record
      return this.prismaService.jadwal_posyandu.delete({
        where,
      });
    } catch (error) {
      console.error('Error deleting jadwal posyandu:', error);
      throw new Error('Failed to delete jadwal posyandu');
    }
  }
}
