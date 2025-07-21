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
    dataKesehatan?: KesehatanIbkDto,
    dataAssesment?: AssesmenIbkDto,
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

    try {
      const createKesehatanIbk = await this.prisma.kesehatan_ibk.create({
        data: {
          odgj: dataKesehatan?.odgj === 'false',
          hasil_diagnosa: dataKesehatan?.hasil_diagnosa ?? '',
          jenis_bantuan: dataKesehatan?.jenis_bantuan ?? '',
          riwayat_terapi: dataKesehatan?.riwayat_terapi ?? '',
          created_at: new Date(),
        },
      });
      const createdIbk = await this.prisma.ibk.create({
        data: {
          users_kader_id: userKaderId.id,
          nama: dataIbk?.nama ?? '',
          nik: dataIbk?.nik ? parseInt(dataIbk.nik, 10) : null,
          tempat_lahir: dataIbk?.tempat_lahir ?? '',
          tanggal_lahir: dataIbk?.tanggal_lahir ?? '',
          file_foto: dataIbk?.file_foto ?? '',
          jenis_kelamin: dataIbk?.jenis_kelamin ?? '',
          agama: dataIbk?.agama ?? '',
          umur: dataIbk?.umur ? parseInt(dataIbk.umur, 10) : null,
          alamat: dataIbk?.alamat ?? '',
          no_telp: dataIbk?.no_telp ?? '',
          nama_wali: dataIbk?.nama_wali ?? '',
          no_telp_wali: dataIbk?.no_telp_wali ?? '',
          posyanduId: dataIbk?.posyanduId ?? '',
          created_at: new Date(),
          kesehatan_ibk_id: createKesehatanIbk?.id ?? null,
        },
      });
      return {
        ...createdIbk,
        nik:
          createdIbk.nik !== null && createdIbk.nik !== undefined
            ? Number(createdIbk.nik)
            : null,
        ...createKesehatanIbk,
      };
    } catch (error) {
      console.error('Error creating kesehatan_ibk:', error);
      throw new Error('Failed to create kesehatan_ibk');
    }

    // Convert BigInt fields to number for serialization
  }
}
