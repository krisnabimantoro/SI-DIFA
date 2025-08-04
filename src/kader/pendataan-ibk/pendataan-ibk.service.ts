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
  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ibkWhereUniqueInput;
      where?: Prisma.ibkWhereInput;
      orderBy?: Prisma.ibkOrderByWithRelationInput;
      posyanduId?: string;
    } = {},
  ): Promise<any> {
    const { skip, take = 10, where, orderBy, posyanduId } = params;

    // Build where condition with posyanduId filter
    const whereCondition = {
      ...where,
      ...(posyanduId && { posyanduId }),
    };

    const [dataIbk, totalData] = await Promise.all([
      this.prisma.ibk.findMany({
        skip,
        take,
        where: whereCondition,
        orderBy,
        select: {
          id: true,
          nik: true,
          nama: true,
          jenis_kelamin: true,
          alamat: true,
          created_at: true,
        },
      }),
      this.prisma.ibk.count({ where: whereCondition }),
    ]);

    const totalPage = Math.ceil(totalData / take);

    return {
      data: dataIbk.map((ibk) => ({
        ...ibk,
        nik: ibk.nik != null ? Number(ibk.nik) : null,
      })),
      meta: {
        totalData,
        totalPage,
        currentPage: skip ? Math.floor(skip / take) + 1 : 1,
        limit: take,
      },
    };
  }

  async findOne(where: Prisma.ibkWhereUniqueInput): Promise<any> {
    const ibk = await this.prisma.ibk.findUnique({
      where,
      include: {
        kesehatan_ibk: true,
        detail_ibk: true,
        assesmen_ibk: true,
      },
    });
    if (!ibk) return { message: 'IBK not found' };
    return {
      ...ibk,
      nik: ibk.nik != null ? Number(ibk.nik) : null,
    };
  }

  async update(
    where: Prisma.ibkWhereUniqueInput,
    dataIbk: IbkDto,
    dataKesehatan?: KesehatanIbkDto,
    dataDetailIbk?: DetailIbkDto,
    dataAssesment?: AssesmenIbkDto,
  ): Promise<any> {
    try {
      // Get existing IBK record
      const existingIbk = await this.prisma.ibk.findUnique({
        where,
        include: {
          kesehatan_ibk: true,
          detail_ibk: true,
          assesmen_ibk: true,
        },
      });

      if (!existingIbk) {
        throw new Error('IBK record not found');
      }

      // Update kesehatan_ibk if data provided
      let updatedKesehatanIbk: any = null;
      if (dataKesehatan && existingIbk.kesehatan_ibk_id) {
        updatedKesehatanIbk = await this.prisma.kesehatan_ibk.update({
          where: { id: existingIbk.kesehatan_ibk_id },
          data: {
            odgj: dataKesehatan.odgj === 'false',
            hasil_diagnosa: dataKesehatan.hasil_diagnosa ?? '',
            jenis_bantuan: dataKesehatan.jenis_bantuan ?? '',
            riwayat_terapi: dataKesehatan.riwayat_terapi ?? '',
            updated_at: new Date(),
          },
        });
      }

      // Update detail_ibk if data provided
      let updatedDetailIbk: any = null;
      if (dataDetailIbk && existingIbk.detail_ibk_id) {
        updatedDetailIbk = await this.prisma.detail_ibk.update({
          where: { id: existingIbk.detail_ibk_id },
          data: {
            pekerjaan: dataDetailIbk.pekerjaan ?? '',
            pendidikan: dataDetailIbk.pendidikan ?? '',
            status_perkawinan: dataDetailIbk.status_perkawinan ?? '',
            titik_koordinat: dataDetailIbk.titik_koordinat ?? '',
            keterangan_tambahan: dataDetailIbk.keterangan_tambahan ?? '',
            updated_at: new Date(),
          },
        });
      }

      // Update assesmen_ibk if data provided
      let updatedAssesmenIbk: any = null;
      if (dataAssesment && existingIbk.assesmen_ibk_id) {
        updatedAssesmenIbk = await this.prisma.assesmen_ibk.update({
          where: { id: existingIbk.assesmen_ibk_id },
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
            rekomendasi_intervensi: dataAssesment.rekomendasi_intervensi ?? '',
            updated_at: new Date(),
          },
        });
      }

      // Update main IBK record
      const updatedIbk = await this.prisma.ibk.update({
        where,
        data: {
          nama: dataIbk.nama ?? existingIbk.nama,
          nik: dataIbk.nik ? parseInt(dataIbk.nik, 10) : existingIbk.nik,
          tempat_lahir: dataIbk.tempat_lahir ?? existingIbk.tempat_lahir,
          tanggal_lahir: dataIbk.tanggal_lahir ?? existingIbk.tanggal_lahir,
          file_foto: dataIbk.file_foto ?? existingIbk.file_foto,
          jenis_kelamin: dataIbk.jenis_kelamin ?? existingIbk.jenis_kelamin,
          agama: dataIbk.agama ?? existingIbk.agama,
          umur: dataIbk.umur ? parseInt(dataIbk.umur, 10) : existingIbk.umur,
          alamat: dataIbk.alamat ?? existingIbk.alamat,
          no_telp: dataIbk.no_telp ?? existingIbk.no_telp,
          nama_wali: dataIbk.nama_wali ?? existingIbk.nama_wali,
          no_telp_wali: dataIbk.no_telp_wali ?? existingIbk.no_telp_wali,
          posyanduId: dataIbk.posyanduId ?? existingIbk.posyanduId,
          updated_at: new Date(),
        },
      });

      return {
        ...updatedIbk,
        nik: updatedIbk.nik != null ? Number(updatedIbk.nik) : null,
        ...(updatedDetailIbk ? { detail_ibk: updatedDetailIbk } : {}),
        ...(updatedKesehatanIbk ? { kesehatan_ibk: updatedKesehatanIbk } : {}),
        ...(updatedAssesmenIbk ? { assesmen_ibk: updatedAssesmenIbk } : {}),
      };
    } catch (error) {
      console.error('Error updating data:', error);
      throw new Error('Failed to update data');
    }
  }

  async delete(where: Prisma.ibkWhereUniqueInput): Promise<any> {
    try {
      // Get existing IBK record with related data
      const existingIbk = await this.prisma.ibk.findUnique({
        where,
        include: {
          kesehatan_ibk: true,
          detail_ibk: true,
          assesmen_ibk: true,
          disabilitas_ibk: true,
          presensi_ibk: true,
          monitoring_ibk: true,
        },
      });

      if (!existingIbk) {
        throw new Error('IBK record not found');
      }

      // Delete related records first (due to foreign key constraints)

      // Delete disabilitas_ibk records
      if (existingIbk.disabilitas_ibk.length > 0) {
        await this.prisma.disabilitas_ibk.deleteMany({
          where: { ibk_id: existingIbk.id },
        });
      }

      // Delete presensi_ibk records
      if (existingIbk.presensi_ibk.length > 0) {
        await this.prisma.presensi_ibk.deleteMany({
          where: { user_ibk_id: existingIbk.id },
        });
      }

      // Delete monitoring_ibk records
      if (existingIbk.monitoring_ibk.length > 0) {
        await this.prisma.monitoring_ibk.deleteMany({
          where: { ibk_id: existingIbk.id },
        });
      }

      // Delete main IBK record
      const deletedIbk = await this.prisma.ibk.delete({
        where,
      });

      // Delete related standalone records after IBK is deleted
      if (existingIbk.kesehatan_ibk_id) {
        await this.prisma.kesehatan_ibk.delete({
          where: { id: existingIbk.kesehatan_ibk_id },
        });
      }

      if (existingIbk.detail_ibk_id) {
        await this.prisma.detail_ibk.delete({
          where: { id: existingIbk.detail_ibk_id },
        });
      }

      if (existingIbk.assesmen_ibk_id) {
        await this.prisma.assesmen_ibk.delete({
          where: { id: existingIbk.assesmen_ibk_id },
        });
      }

      return {
        message: 'IBK deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting data:', error);
      throw new Error('Failed to delete data');
    }
  }
}
