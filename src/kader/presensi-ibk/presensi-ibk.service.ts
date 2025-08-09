import { Injectable } from '@nestjs/common';
import { CreatePresensiIbkDto } from './dto/create-presensi-ibk.dto';
import { UpdatePresensiIbkDto } from './dto/update-presensi-ibk.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, presensi_ibk, jadwal_posyandu } from '@prisma/client';

@Injectable()
export class PresensiIbkService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPresensiIbkDto: CreatePresensiIbkDto,
  ): Promise<presensi_ibk> {
    return this.prismaService.presensi_ibk.create({
      data: {
        user_ibk_id: createPresensiIbkDto.user_ibk_id,
        jadwal_id: createPresensiIbkDto.jadwal_id,
        status_presensi: 'HADIR',
        created_at: new Date(),
      },
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.presensi_ibkWhereUniqueInput;
      where?: Prisma.presensi_ibkWhereInput;
      orderBy?: Prisma.presensi_ibkOrderByWithRelationInput;
      jadwalId?: string;
    } = {},
  ): Promise<{
    data: Prisma.presensi_ibkGetPayload<{
      select: {
        id: true;
        user_ibk_id: true;
        jadwal_id: true;
        status_presensi: true;
        created_at: true;
        updated_at: true;
        ibk: {
          select: {
            id: true;
            nama: true;
            nik: true;
          };
        };
      };
    }>[];
    meta: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      limit: number;
    };
  }> {
    const { skip, take = 10, where, orderBy, jadwalId } = params;

    // Build where condition with jadwalId filter
    const whereCondition = {
      ...where,
      ...(jadwalId && { jadwal_id: jadwalId }),
    };

    // Custom ordering: order by IBK name alphabetically
    const defaultOrderBy = orderBy || {
      ibk: {
        nama: 'asc',
      },
    };

    const [dataPresensi, totalData] = await Promise.all([
      this.prismaService.presensi_ibk.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy: defaultOrderBy,
        select: {
          id: true,
          user_ibk_id: true,
          jadwal_id: true,
          status_presensi: true,
          created_at: true,
          updated_at: true,
          ibk: {
            select: {
              id: true,
              nama: true,
              nik: true,
              posyanduId: true,
            },
          },
        },
      }),
      this.prismaService.presensi_ibk.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataPresensi.map((presensi) => ({
        ...presensi,
        ibk: {
          ...presensi.ibk,
          nik: presensi.ibk.nik != null ? Number(presensi.ibk.nik) : null,
        },
      })) as any,
      meta: {
        totalData,
        totalPage,
        currentPage: skip ? Math.floor(skip / take) + 1 : 1,
        limit: take,
      },
    };
  }

  async findOne(
    where: Prisma.presensi_ibkWhereUniqueInput,
  ): Promise<presensi_ibk | null> {
    const presensi = await this.prismaService.presensi_ibk.findUnique({
      where,
      include: {
        ibk: {
          select: {
            id: true,
            nama: true,
            nik: true,
            jenis_kelamin: true,
            alamat: true,
          },
        },
        jadwal_posyandu: {
          select: {
            id: true,
            nama_kegiatan: true,
            tanggal: true,
            waktu_mulai: true,
            waktu_selesai: true,
            lokasi: true,
          },
        },
      },
    });

    if (!presensi) return null;

    return {
      ...presensi,
      ibk: {
        ...presensi.ibk,
        nik: presensi.ibk.nik != null ? Number(presensi.ibk.nik) : null,
      },
    } as any;
  }

  async update(
    where: Prisma.presensi_ibkWhereUniqueInput,
    updatePresensiIbkDto: UpdatePresensiIbkDto,
  ): Promise<presensi_ibk> {
    return this.prismaService.presensi_ibk.update({
      where,
      data: {
        ...updatePresensiIbkDto,
        updated_at: new Date(),
      },
    });
  }

  async remove(
    where: Prisma.presensi_ibkWhereUniqueInput,
  ): Promise<presensi_ibk> {
    return this.prismaService.presensi_ibk.delete({
      where,
    });
  }

  async bulkUpdateStatus(
    jadwalId: string,
    updates: { user_ibk_id: string; status_presensi: string }[],
  ): Promise<{ count: number }> {
    // Bulk update presensi status for multiple IBK users
    const updatePromises = updates.map((update) =>
      this.prismaService.presensi_ibk.updateMany({
        where: {
          jadwal_id: jadwalId,
          user_ibk_id: update.user_ibk_id,
        },
        data: {
          status_presensi: update.status_presensi,
          updated_at: new Date(),
        },
      }),
    );

    const results = await Promise.all(updatePromises);
    const totalUpdated = results.reduce((sum, result) => sum + result.count, 0);

    return { count: totalUpdated };
  }

  async findIbkNotRegistered(
    params: {
      posyanduId?: string;
      jadwalId?: string;
    } = {},
  ): Promise<any> {
    const { jadwalId, posyanduId } = params;

    const [dataIbk] = await Promise.all([
      this.prismaService.ibk.findMany({
        where: {
          ...(posyanduId && { posyanduId }),
          presensi_ibk: {
            none: {
              jadwal_id: jadwalId,
            },
          },
        },
        select: {
          id: true,
          nik: true,
          nama: true,
          posyanduId: true,
        },
      }),
    ]);

    return {
      data: dataIbk.map((ibk) => ({
        ...ibk,
        nik: ibk.nik != null ? Number(ibk.nik) : null,
      })),
    };
  }
}
