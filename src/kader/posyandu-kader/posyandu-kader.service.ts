import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, posyandu, users_kader } from '@prisma/client';
@Injectable()
export class PosyanduKaderService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    usersWhereInput: Prisma.users_kaderWhereInput,
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.posyanduWhereUniqueInput;
      where?: Prisma.posyanduWhereInput;
      orderBy?: Prisma.posyanduOrderByWithRelationInput;
      page?: number;
    } = {},
  ): Promise<{
    data: (posyandu & { is_registered: boolean })[];
    meta: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      limit: number;
    };
  }> {
    const { skip, take = 10, where, orderBy } = params;

    const userKader = await this.prisma.users_kader.findFirst({
      where: usersWhereInput,
      select: { id: true },
    });

    if (!userKader) {
      throw new Error('User kader not found');
    }

    const userKaderId = userKader.id;

    // Ambil semua ID posyandu yang sudah diregister oleh user_kader_id
    const registeredPosyandu = await this.prisma.kader_posyandu.findMany({
      where: {
        user_kader_id: userKaderId,
        deleted_at: null,
      },
      select: {
        posyandu_id: true,
      },
    });

    const registeredPosyanduIds = new Set(
      registeredPosyandu.map((kp) => kp.posyandu_id),
    );

    // Ambil data posyandu seperti biasa (tanpa include relasi)
    const [dataPosyandu, totalData] = await Promise.all([
      this.prisma.posyandu.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      this.prisma.posyandu.count({ where }),
    ]);

    const data = dataPosyandu.map((p) => ({
      ...p,
      is_registered: registeredPosyanduIds.has(p.id),
    }));

    return {
      data,
      meta: {
        totalData,
        totalPage: Math.ceil(totalData / take),
        currentPage: skip ? Math.ceil(skip / take) + 1 : 1,
        limit: take,
      },
    };
  }
}
