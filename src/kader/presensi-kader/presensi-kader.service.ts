import { Injectable } from '@nestjs/common';
import { CreatePresensiKaderDto } from './dto/create-presensi-kader.dto';
import { UpdatePresensiKaderDto } from './dto/update-presensi-kader.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, presensi_kader } from '@prisma/client';

@Injectable()
export class PresensiKaderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPresensiKaderDto: CreatePresensiKaderDto,
  ): Promise<presensi_kader> {
    return this.prismaService.presensi_kader.create({
      data: {
        user_kader_id: createPresensiKaderDto.user_kader_id,
        jadwal_id: createPresensiKaderDto.jadwal_id,
        status_presensi: 'HADIR',
        created_at: new Date(),
      },
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.presensi_kaderWhereUniqueInput;
      where?: Prisma.presensi_kaderWhereInput;
      orderBy?: Prisma.presensi_kaderOrderByWithRelationInput;
      jadwalId?: string;
    } = {},
  ): Promise<{
    data: Prisma.presensi_kaderGetPayload<{
      select: {
        id: true;
        user_kader_id: true;
        jadwal_id: true;
        status_presensi: true;
        created_at: true;
        users_kader: {
          select: {
            id: true;
            jabatan: true;
            users: {
              select: {
                id: true;
                name: true;
                email: true;
                no_telp: true;
              };
            };
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

    const [dataPresensi, totalData] = await Promise.all([
      this.prismaService.presensi_kader.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy,
        select: {
          id: true,
          user_kader_id: true,
          jadwal_id: true,
          status_presensi: true,
          created_at: true,
          users_kader: {
            select: {
              id: true,
              jabatan: true,
              users: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  no_telp: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.presensi_kader.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataPresensi,
      meta: {
        totalData,
        totalPage,
        currentPage: skip ? Math.floor(skip / take) + 1 : 1,
        limit: take,
      },
    };
  }

  async findOne(
    where: Prisma.presensi_kaderWhereUniqueInput,
  ): Promise<presensi_kader | null> {
    return this.prismaService.presensi_kader.findUnique({
      where,
      include: {
        users_kader: {
          select: {
            id: true,
            jabatan: true,
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                no_telp: true,
              },
            },
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
            posyandu: {
              select: {
                id: true,
                nama_posyandu: true,
                alamat: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    where: Prisma.presensi_kaderWhereUniqueInput,
    updatePresensiKaderDto: UpdatePresensiKaderDto,
  ): Promise<presensi_kader> {
    return this.prismaService.presensi_kader.update({
      where,
      data: {
        ...updatePresensiKaderDto,
        updated_at: new Date(),
      },
    });
  }

  async remove(
    where: Prisma.presensi_kaderWhereUniqueInput,
  ): Promise<presensi_kader> {
    return this.prismaService.presensi_kader.delete({
      where,
    });
  }

  async bulkUpdateStatus(
    jadwalId: string,
    updates: { user_kader_id: string; status_presensi: string }[],
  ): Promise<{ count: number }> {
    // Bulk update presensi status for multiple kader users
    const updatePromises = updates.map((update) =>
      this.prismaService.presensi_kader.updateMany({
        where: {
          jadwal_id: jadwalId,
          user_kader_id: update.user_kader_id,
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

  async findKaderNotRegistered(
    params: {
      posyanduId?: string;
      jadwalId?: string;
    } = {},
  ): Promise<any> {
    const { jadwalId, posyanduId } = params;

    const [dataKader] = await Promise.all([
      this.prismaService.users_kader.findMany({
        where: {
          ...(posyanduId && {
            kader_posyandu: {
              some: {
                posyandu_id: posyanduId,
              },
            },
          }),
          presensi_kader: {
            none: {
              jadwal_id: jadwalId,
            },
          },
        },
        select: {
          id: true,
          jabatan: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              no_telp: true,
            },
          },
        },
      }),
    ]);

    return {
      data: dataKader,
    };
  }
}
