import { Injectable } from '@nestjs/common';
import { CreatePendataanIbkDto } from './dto/create-pendataan-ibk.dto';
import { UpdatePendataanIbkDto } from './dto/update-pendataan-ibk.dto';
import { PrismaService } from '../../prisma.service';
import { IbkDto } from './dto/ibk.dto';
import { AssesmenIbkDto } from './dto/assesmen-ibk.dto';
import { KesehatanIbkDto } from './dto/kesehatan-ibk.dto';
import { DisabilitasIbkDto } from './dto/disabilitas-ibk.dto';
import { users } from '../../../generated/prisma/index';

import { Prisma } from '@prisma/client';
@Injectable()
export class PendataanIbkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    usersWhereInput: Prisma.users_kaderWhereInput,
    dataIbk: IbkDto,
    dataAssesment?: AssesmenIbkDto,
    dataKesehatan?: KesehatanIbkDto,
    difabilitasIbk?: DisabilitasIbkDto,
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

    const createdIbk = await this.prisma.ibk.create({
      data: {
        users_kaderId: userKaderId.id,
        ...{
          ...dataIbk,
          umur: dataIbk.umur ? parseInt(dataIbk.umur, 10) : null,
          nik: dataIbk.nik ? parseInt(dataIbk.nik, 10) : null,
          created_at: new Date(),
        },
      },
    });

    // Convert BigInt fields to number for serialization
    return {
      ...createdIbk,
      nik:
        createdIbk.nik !== null && createdIbk.nik !== undefined
          ? Number(createdIbk.nik)
          : null,
    };
  }
}
