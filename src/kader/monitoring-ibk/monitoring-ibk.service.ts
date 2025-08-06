import { Injectable } from '@nestjs/common';
import { CreateMonitoringIbkDto } from './dto/create-monitoring-ibk.dto';
import { UpdateMonitoringIbkDto } from './dto/update-monitoring-ibk.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, monitoring_ibk } from '@prisma/client';

@Injectable()
export class MonitoringIbkService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createMonitoringIbkDto: CreateMonitoringIbkDto,
  ): Promise<monitoring_ibk> {
    const userKaderId = await this.prismaService.users_kader.findFirst({
      where: {
        user_id: createMonitoringIbkDto.users_kader_id,
      },
      select: {
        id: true,
      },
    });

    return this.prismaService.monitoring_ibk.create({
      data: {
        ibk_id: createMonitoringIbkDto.ibk_id,
        users_kader_id: userKaderId?.id,
        jadwal_posyandu_id: createMonitoringIbkDto.jadwal_posyandu_id,
        keluhan: createMonitoringIbkDto.keluhan,
        perilaku_baru: createMonitoringIbkDto.perilaku_baru,
        tindak_lanjut: createMonitoringIbkDto.tindak_lanjut,
        fungsional_checklist: createMonitoringIbkDto.fungsional_checklist,
        tanggal_kunjungan: createMonitoringIbkDto.tanggal_kunjungan,
        kecamatan: createMonitoringIbkDto.kecamatan,
        keterangan: createMonitoringIbkDto.keterangan,
        created_at: new Date(),
      },
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.monitoring_ibkWhereUniqueInput;
      where?: Prisma.monitoring_ibkWhereInput;
      orderBy?: Prisma.monitoring_ibkOrderByWithRelationInput;
      jadwalId?: string;
    } = {},
  ): Promise<{
    data: Prisma.monitoring_ibkGetPayload<{
      select: {
        id: true;
        ibk_id: true;
        users_kader_id: true;
        jadwal_posyandu_id: true;
        keluhan: true;
        perilaku_baru: true;
        tindak_lanjut: true;
        tanggal_kunjungan: true;
        kecamatan: true;
        created_at: true;
        ibk: {
          select: {
            id: true;
            nama: true;
            nik: true;
            jenis_kelamin: true;
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

    // Build where condition with filters
    const whereCondition = {
      ...where,
      ...(jadwalId && { jadwal_posyandu_id: jadwalId }),
    };

    const [dataMonitoring, totalData] = await Promise.all([
      this.prismaService.monitoring_ibk.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy,
        select: {
          id: true,
          ibk_id: true,
          keluhan: true,
          perilaku_baru: true,
          tanggal_kunjungan: true,
          kecamatan: true,
          created_at: true,
          ibk: {
            select: {
              id: true,
              nama: true,
              nik: true,
            },
          },
        },
      }),
      this.prismaService.monitoring_ibk.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataMonitoring.map((monitoring) => ({
        ...monitoring,
        ibk: {
          ...monitoring.ibk,
          nik: monitoring.ibk.nik != null ? Number(monitoring.ibk.nik) : null,
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
    where: Prisma.monitoring_ibkWhereUniqueInput,
  ): Promise<monitoring_ibk | null> {
    const monitoring = await this.prismaService.monitoring_ibk.findUnique({
      where,
      include: {
        ibk: {
          select: {
            id: true,
            nama: true,
            nik: true,
            jenis_kelamin: true,
            alamat: true,
            umur: true,
            no_telp: true,
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
    });

    if (!monitoring) return null;

    return {
      ...monitoring,
      ibk: {
        ...monitoring.ibk,
        nik: monitoring.ibk.nik != null ? Number(monitoring.ibk.nik) : null,
      },
    } as any;
  }

  async update(
    where: Prisma.monitoring_ibkWhereUniqueInput,
    updateMonitoringIbkDto: UpdateMonitoringIbkDto,
  ): Promise<monitoring_ibk> {
    return this.prismaService.monitoring_ibk.update({
      where,
      data: {
        ...(updateMonitoringIbkDto.ibk_id && {
          ibk_id: updateMonitoringIbkDto.ibk_id,
        }),
        ...(updateMonitoringIbkDto.users_kader_id && {
          users_kader_id: updateMonitoringIbkDto.users_kader_id,
        }),
        ...(updateMonitoringIbkDto.jadwal_posyandu_id && {
          jadwal_posyandu_id: updateMonitoringIbkDto.jadwal_posyandu_id,
        }),
        ...(updateMonitoringIbkDto.keluhan !== undefined && {
          keluhan: updateMonitoringIbkDto.keluhan,
        }),
        ...(updateMonitoringIbkDto.perilaku_baru !== undefined && {
          perilaku_baru: updateMonitoringIbkDto.perilaku_baru,
        }),
        ...(updateMonitoringIbkDto.tindak_lanjut !== undefined && {
          tindak_lanjut: updateMonitoringIbkDto.tindak_lanjut,
        }),
        ...(updateMonitoringIbkDto.fungsional_checklist !== undefined && {
          fungsional_checklist: updateMonitoringIbkDto.fungsional_checklist,
        }),
        ...(updateMonitoringIbkDto.tanggal_kunjungan && {
          tanggal_kunjungan: updateMonitoringIbkDto.tanggal_kunjungan,
        }),
        ...(updateMonitoringIbkDto.kecamatan !== undefined && {
          kecamatan: updateMonitoringIbkDto.kecamatan,
        }),
        ...(updateMonitoringIbkDto.keterangan !== undefined && {
          keterangan: updateMonitoringIbkDto.keterangan,
        }),
        updated_at: new Date(),
      },
    });
  }

  async remove(
    where: Prisma.monitoring_ibkWhereUniqueInput,
  ): Promise<monitoring_ibk> {
    return this.prismaService.monitoring_ibk.delete({
      where,
    });
  }

  async findByIbk(ibkId: string): Promise<monitoring_ibk[]> {
    return this.prismaService.monitoring_ibk.findMany({
      where: {
        ibk_id: ibkId,
      },
      include: {
        jadwal_posyandu: {
          select: {
            id: true,
            nama_kegiatan: true,
            tanggal: true,
          },
        },
        users_kader: {
          select: {
            id: true,
            jabatan: true,
            users: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        tanggal_kunjungan: 'desc',
      },
    });
  }
}
