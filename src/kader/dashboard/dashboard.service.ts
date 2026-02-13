import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(posyanduId: string) {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [totalAnggota, totalIbk, kunjunganBulanIni] = await Promise.all([
      this.prisma.kader_posyandu.count({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
        },
      }),
      this.prisma.ibk.count({
        where: {
          posyanduId: posyanduId,
          deleted_at: null,
        },
      }),
      this.prisma.jadwal_posyandu.count({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    return {
      data: {
        totalAnggota,
        totalIbk,
        kunjunganBulanIni,
      },
    };
  }

  async getKunjunganBulanIni(
    posyanduId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [jadwalKegiatan, totalData] = await Promise.all([
      this.prisma.jadwal_posyandu.findMany({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        skip,
        take: limit,
        orderBy: {
          tanggal: 'desc',
        },
        include: {
          posyandu: {
            select: {
              id: true,
              nama_posyandu: true,
              alamat: true,
            },
          },
        },
      }),
      this.prisma.jadwal_posyandu.count({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data: jadwalKegiatan,
      meta: {
        totalData,
        totalPage,
        currentPage: page,
        limit,
      },
    };
  }
}
