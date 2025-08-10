import { Injectable } from '@nestjs/common';
import { CreateDisabilitasIbkDto } from './dto/create-disabilitas-ibk.dto';
import { UpdateDisabilitasIbkDto } from './dto/update-disabilitas-ibk.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, disabilitas_ibk } from '@prisma/client';

@Injectable()
export class DisabilitasIbkService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createDisabilitasIbkDto: CreateDisabilitasIbkDto,
  ): Promise<disabilitas_ibk> {
    return this.prismaService.disabilitas_ibk.create({
      data: {
        ibk_id: createDisabilitasIbkDto.ibk_id,
        jenis_difabilitas_id: createDisabilitasIbkDto.jenis_difabilitas_id,
        tingkat_keparahan: createDisabilitasIbkDto.tingkat_keparahan,
        sejak_kapan: createDisabilitasIbkDto.sejak_kapan,
        keterangan: createDisabilitasIbkDto.keterangan,
        created_at: new Date(),
      },
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.disabilitas_ibkWhereUniqueInput;
      where?: Prisma.disabilitas_ibkWhereInput;
      orderBy?: Prisma.disabilitas_ibkOrderByWithRelationInput;
      ibkId?: string;
      jenisDisabilitasId?: string;
    } = {},
  ): Promise<{
    data: Prisma.disabilitas_ibkGetPayload<{
      select: {
        id: true;
        ibk_id: true;
        jenis_difabilitas_id: true;
        tingkat_keparahan: true;
        sejak_kapan: true;
        keterangan: true;
        created_at: true;
        updated_at: true;
        ibk: {
          select: {
            id: true;
            nama: true;
            nik: true;
          };
        };
        jenis_difasilitas: {
          select: {
            id: true;
            nama: true;
            deskripsi: true;
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
    const {
      skip,
      take = 10,
      where,
      orderBy,
      ibkId,
      jenisDisabilitasId,
    } = params;

    // Build where condition with filters
    const whereCondition = {
      ...where,
      ...(ibkId && { ibk_id: ibkId }),
      ...(jenisDisabilitasId && { jenis_difabilitas_id: jenisDisabilitasId }),
    };

    // Custom ordering: order by IBK name alphabetically
    const defaultOrderBy = orderBy || {
      ibk: {
        nama: 'asc',
      },
    };

    const [dataDisabilitas, totalData] = await Promise.all([
      this.prismaService.disabilitas_ibk.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy: defaultOrderBy,
        select: {
          id: true,
          ibk_id: true,
          jenis_difabilitas_id: true,
          tingkat_keparahan: true,
          sejak_kapan: true,
          keterangan: true,
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
          jenis_difasilitas: {
            select: {
              id: true,
              nama: true,
              deskripsi: true,
            },
          },
        },
      }),
      this.prismaService.disabilitas_ibk.count({
        where: whereCondition,
      }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataDisabilitas.map((disabilitas) => ({
        ...disabilitas,
        ibk: {
          ...disabilitas.ibk,
          nik: disabilitas.ibk.nik != null ? Number(disabilitas.ibk.nik) : null,
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
    where: Prisma.disabilitas_ibkWhereUniqueInput,
  ): Promise<disabilitas_ibk | null> {
    const disabilitas = await this.prismaService.disabilitas_ibk.findUnique({
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
            posyanduId: true,
          },
        },
        jenis_difasilitas: {
          select: {
            id: true,
            nama: true,
            deskripsi: true,
          },
        },
      },
    });

    if (!disabilitas) return null;

    return {
      ...disabilitas,
      ibk: {
        ...disabilitas.ibk,
        nik: disabilitas.ibk.nik != null ? Number(disabilitas.ibk.nik) : null,
      },
    } as any;
  }

  async update(
    where: Prisma.disabilitas_ibkWhereUniqueInput,
    updateDisabilitasIbkDto: UpdateDisabilitasIbkDto,
  ): Promise<disabilitas_ibk> {
    return this.prismaService.disabilitas_ibk.update({
      where,
      data: {
        ...updateDisabilitasIbkDto,
        updated_at: new Date(),
      },
    });
  }

  async remove(
    where: Prisma.disabilitas_ibkWhereUniqueInput,
  ): Promise<disabilitas_ibk> {
    return this.prismaService.disabilitas_ibk.delete({
      where,
    });
  }

  async findByIbk(ibkId: string): Promise<any[]> {
    const disabilitasList = await this.prismaService.disabilitas_ibk.findMany({
      where: {
        ibk_id: ibkId,
      },
      include: {
        jenis_difasilitas: {
          select: {
            id: true,
            nama: true,
            deskripsi: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return disabilitasList;
  }

  async findByJenisDisabilitas(jenisDisabilitasId: string): Promise<any[]> {
    const disabilitasList = await this.prismaService.disabilitas_ibk.findMany({
      where: {
        jenis_difabilitas_id: jenisDisabilitasId,
      },
      include: {
        ibk: {
          select: {
            id: true,
            nama: true,
            nik: true,
            posyanduId: true,
          },
        },
      },
      orderBy: {
        ibk: {
          nama: 'asc',
        },
      },
    });

    return disabilitasList.map((disabilitas) => ({
      ...disabilitas,
      ibk: {
        ...disabilitas.ibk,
        nik: disabilitas.ibk.nik != null ? Number(disabilitas.ibk.nik) : null,
      },
    }));
  }

  async getAllJenisDisabilitas(): Promise<any[]> {
    return this.prismaService.jenis_difasilitas.findMany({
      orderBy: {
        nama: 'asc',
      },
    });
  }
}
