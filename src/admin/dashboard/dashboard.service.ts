import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalPosyandu, totalKader, totalIbk, kaderNeedVerification] =
      await Promise.all([
        this.prisma.posyandu.count({
          where: {
            deleted_at: null,
          },
        }),
        this.prisma.users_kader.count({
          where: {
            deleted_at: null,
          },
        }),
        this.prisma.ibk.count({
          where: {
            deleted_at: null,
          },
        }),
        this.prisma.users.count({
          where: {
            role: 'kader',
            verification: 'unverified',
            deleted_at: null,
          },
        }),
      ]);

    return {
      data: {
        totalPosyandu,
        totalKader,
        totalIbk,
        kaderNeedVerification,
      },
    };
  }

  async getJadwalKegiatan(page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;

    const [jadwalKegiatan, totalData] = await Promise.all([
      this.prisma.jadwal_posyandu.findMany({
        where: {
          deleted_at: null,
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
          deleted_at: null,
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

  async getKaderNeedVerification(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [kaderList, totalData] = await Promise.all([
      this.prisma.users.findMany({
        where: {
          role: 'kader',
          verification: 'pending',
          deleted_at: null,
        },
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          no_telp: true,
          verification: true,
          created_at: true,
        },
      }),
      this.prisma.users.count({
        where: {
          role: 'kader',
          verification: 'pending',
          deleted_at: null,
        },
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data: kaderList,
      meta: {
        totalData,
        totalPage,
        currentPage: page,
        limit,
      },
    };
  }
}
