import { Injectable } from '@nestjs/common';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';
import { PrismaService } from 'src/prisma.service';

import { Prisma, jadwal_posyandu, posyandu } from '@prisma/client';

@Injectable()
export class JadwalPosyanduService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Helper function to spread waktu_datang evenly for all IBK
   * Last person arrives 30 minutes before waktu_selesai
   * @param waktuMulai - Start time (e.g., "08:00")
   * @param waktuSelesai - End time (e.g., "12:00")
   * @param count - Number of time slots to generate
   * @returns Array of time strings spread evenly
   */
  private spreadWaktuDatang(
    waktuMulai: string,
    waktuSelesai: string,
    count: number,
  ): string[] {
    if (count === 0) return [];
    if (count === 1) return [waktuMulai];

    // Parse time strings to minutes
    const parseTime = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Convert minutes back to time string
    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const startMinutes = parseTime(waktuMulai);
    const endMinutes = parseTime(waktuSelesai);

    // Maximum time for last person: 30 minutes before waktu_selesai
    const maxEndMinutes = endMinutes - 30;
    const totalDuration = maxEndMinutes - startMinutes;

    // Calculate interval to distribute all IBK evenly
    const interval = totalDuration / (count - 1);

    // Generate spread times for all IBK
    const times: string[] = [];
    for (let i = 0; i < count; i++) {
      const currentMinutes = Math.round(startMinutes + interval * i);
      times.push(formatTime(currentMinutes));
    }

    return times;
  }

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

    const kaderUsers = await this.prismaService.kader_posyandu.findMany({
      where: {
        posyandu_id: posyanduId,
      },
      select: {
        user_kader_id: true,
      },
    });

    // Create bulk presensi_ibk records for all IBK users
    if (ibkUsers.length > 0) {
      // Generate spread waktu_datang times between waktu_mulai and waktu_selesai
      const spreadTimes = this.spreadWaktuDatang(
        createdJadwal.waktu_mulai || '08:00',
        createdJadwal.waktu_selesai || '12:00',
        ibkUsers.length,
      );

      const presensiIbkData = ibkUsers.map((ibk, index) => ({
        user_ibk_id: ibk.id,
        jadwal_id: createdJadwal.id,
        status_presensi: 'BELUM_HADIR',
        antrian_ke: index + 1, // Sequential queue number
        waktu_datang: spreadTimes[index], // Spread time evenly
        created_at: new Date(),
      }));

      await this.prismaService.presensi_ibk.createMany({
        data: presensiIbkData,
      });
    }

    if (kaderUsers.length > 0) {
      const presensiKaderData = kaderUsers.map((kader) => ({
        user_kader_id: kader.user_kader_id,
        jadwal_id: createdJadwal.id,
        status_presensi: 'BELUM_HADIR',
        created_at: new Date(),
      }));

      await this.prismaService.presensi_kader.createMany({
        data: presensiKaderData,
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
