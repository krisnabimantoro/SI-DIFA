import { Injectable } from '@nestjs/common';
import { CreatePendataanIbkDto } from './dto/create-pendataan-ibk.dto';
import { UpdatePendataanIbkDto } from './dto/update-pendataan-ibk.dto';
import { PrismaService } from '../../prisma.service';
import { IbkDto } from './dto/ibk.dto';
import { AssesmenIbkDto } from './dto/assesmen-ibk.dto';
import { KesehatanIbkDto } from './dto/kesehatan-ibk.dto';
import { DisabilitasIbkDto } from './dto/disabilitas-ibk.dto';
import { Prisma } from '@prisma/client';
import { DetailIbkDto } from './dto/detail-ibk.dto';
@Injectable()
export class PendataanIbkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    usersWhereInput: Prisma.users_kaderWhereInput,
    dataIbk: IbkDto,
    dataKesehatan?: KesehatanIbkDto,
    dataDetailIbk?: DetailIbkDto,
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

      const createDetailIbk = await this.prisma.detail_ibk.create({
        data: {
          pekerjaan: dataDetailIbk?.pekerjaan ?? '',
          pendidikan: dataDetailIbk?.pendidikan ?? '',
          status_perkawinan: dataDetailIbk?.status_perkawinan ?? '',
          titik_koordinat: dataDetailIbk?.titik_koordinat ?? '',
          keterangan_tambahan: dataDetailIbk?.keterangan_tambahan ?? '',
          created_at: new Date(),
        },
      });

      const createAssesmenIbk = dataAssesment
        ? await this.prisma.assesmen_ibk.create({
            data: {
              total_iq: dataAssesment.total_iq
                ? parseInt(dataAssesment.total_iq.toString(), 10)
                : null,
              kategori_iq: dataAssesment.kategori_iq ?? '',
              tipe_kepribadian: dataAssesment.tipe_kepribadian ?? '',
              deskripsi_kepribadian: dataAssesment.deskripsi_kepribadian ?? '',
              potensi: dataAssesment.potensi ?? '',
              minat: dataAssesment.minat ?? '',
              bakat: dataAssesment.bakat ?? '',
              keterampilan: dataAssesment.keterampilan ?? '',
              catatan_psikolog: dataAssesment.catatan_psikolog ?? '',
              rekomendasi_intervensi:
                dataAssesment.rekomendasi_intervensi ?? '',
              created_at: new Date(),
            },
          })
        : null;

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
          detail_ibk_id: createDetailIbk?.id ?? null,
          assesmen_ibk_id: createAssesmenIbk?.id ?? null,
        },
      });

      return {
        ...createdIbk,
        nik: createdIbk.nik != null ? Number(createdIbk.nik) : null,
        ...(createDetailIbk ? { detail_ibk: createDetailIbk } : {}),
        ...(createKesehatanIbk ? { kesehatan_ibk: createKesehatanIbk } : {}),
        ...(createAssesmenIbk ? { assesmen_ibk: createAssesmenIbk } : {}),
      };
    } catch (error) {
      console.error('Error creating data:', error);
      throw new Error('Failed to create data');
    }

    // Convert BigInt fields to number for serialization
  }
}
