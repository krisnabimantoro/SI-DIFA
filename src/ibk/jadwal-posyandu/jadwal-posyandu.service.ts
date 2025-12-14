import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JadwalPosyanduService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get latest jadwal posyandu and presensi for IBK by NIK
   * @param nik - IBK NIK number
   * @returns Latest jadwal posyandu with presensi information
   */
  async getLatestJadwalByNik(nik: string) {
    // Convert NIK to BigInt for comparison
    const nikBigInt = BigInt(nik);

    // Find IBK by NIK
    const ibk = await this.prismaService.ibk.findFirst({
      where: {
        nik: nikBigInt,
      },
      select: {
        id: true,
        nama: true,
        nik: true,
        posyanduId: true,
      },
    });

    if (!ibk) {
      throw new NotFoundException(`IBK with NIK ${nik} not found`);
    }

    if (!ibk.posyanduId) {
      throw new NotFoundException(
        `IBK with NIK ${nik} is not assigned to any posyandu`,
      );
    }

    // Get latest jadwal posyandu for this posyandu
    const latestJadwal = await this.prismaService.jadwal_posyandu.findFirst({
      where: {
        posyandu_id: ibk.posyanduId,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        posyandu: {
          select: {
            id: true,
            nama_posyandu: true,
            alamat: true,
            no_telp: true,
          },
        },
      },
    });

    if (!latestJadwal) {
      throw new NotFoundException('No jadwal posyandu found for this IBK');
    }

    // Get presensi for this IBK in the latest jadwal
    const presensi = await this.prismaService.presensi_ibk.findFirst({
      where: {
        user_ibk_id: ibk.id,
        jadwal_id: latestJadwal.id,
        deleted_at: null,
      },
    });

    return {
      ibk: {
        id: ibk.id,
        nama: ibk.nama,
        nik: ibk.nik?.toString(),
      },
      jadwal_posyandu: {
        id: latestJadwal.id,
        nama_kegiatan: latestJadwal.nama_kegiatan,
        jenis_kegiatan: latestJadwal.jenis_kegiatan,
        deskripsi: latestJadwal.deskripsi,
        lokasi: latestJadwal.lokasi,
        tanggal: latestJadwal.tanggal,
        waktu_mulai: latestJadwal.waktu_mulai,
        waktu_selesai: latestJadwal.waktu_selesai,
        file_name: latestJadwal.file_name,
        created_at: latestJadwal.created_at,
        posyandu: latestJadwal.posyandu,
      },
      presensi_ibk: presensi
        ? {
            id: presensi.id,
            status_presensi: presensi.status_presensi,
            antrian_ke: presensi.antrian_ke,
            waktu_datang: presensi.waktu_datang,
            created_at: presensi.created_at,
            updated_at: presensi.updated_at,
          }
        : null,
    };
  }
}
