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

    // Ambil SEMUA data posyandu terlebih dahulu (tanpa pagination)
    const [allPosyandu, totalData] = await Promise.all([
      this.prisma.posyandu.findMany({
        where,
        orderBy: { nama_posyandu: 'asc' }, // First order by name
      }),
      this.prisma.posyandu.count({ where }),
    ]);

    // Map dengan is_registered dan sort dengan prioritas
    const sortedData = allPosyandu
      .map((p) => ({
        ...p,
        is_registered: registeredPosyanduIds.has(p.id),
      }))
      .sort((a, b) => {
        // First priority: registered status (true first)
        if (a.is_registered !== b.is_registered) {
          return b.is_registered ? 1 : -1;
        }
        // Second priority: name (alphabetical)
        return a.nama_posyandu.localeCompare(b.nama_posyandu);
      });

    // Apply pagination AFTER sorting
    const data = sortedData.slice(skip || 0, (skip || 0) + take);

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
