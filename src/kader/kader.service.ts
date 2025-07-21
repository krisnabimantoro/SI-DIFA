import { Injectable } from '@nestjs/common';
import { CreateKaderDto } from './dto/create-kader.dto';
import { UpdateKaderDto } from './dto/update-kader.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, kader_posyandu } from '@prisma/client';
import { KaderPosyanduDto } from './dto/kader-posyandu';

@Injectable()
export class KaderService {
  constructor(readonly prisma: PrismaService) {}

  async registerKaderPosyandu(
    usersWhereInput: Prisma.users_kaderWhereInput,
    data: KaderPosyanduDto,
  ): Promise<any> {
    const userKaderId = await this.prisma.users_kader.findFirst({
      where: usersWhereInput,
      select: {
        id: true,
      },
    });

    if (!userKaderId) {
      throw new Error('UserKaderId not found');
    }

    return await this.prisma.kader_posyandu.create({
      data: {
        user_kader_id: userKaderId.id,
        posyandu_id: data.posyandu_id,
        created_at: new Date(),
      },
    });
  }

  update(id: number, updateKaderDto: UpdateKaderDto) {
    return `This action updates a #${id} kader`;
  }
}
