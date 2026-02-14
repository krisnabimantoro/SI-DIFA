import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(posyanduId: string) {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [totalAnggota, totalIbk, kunjunganBulanIni] = await Promise.all([
      this.prisma.kader_posyandu.count({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
        },
      }),
      this.prisma.ibk.count({
        where: {
          posyanduId: posyanduId,
          deleted_at: null,
        },
      }),
      this.prisma.jadwal_posyandu.count({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    return {
      data: {
        totalAnggota,
        totalIbk,
        kunjunganBulanIni,
      },
    };
  }

  async getKunjunganBulanIni(
    posyanduId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [jadwalKegiatan, totalData] = await Promise.all([
      this.prisma.jadwal_posyandu.findMany({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        skip,
        take: limit,
        orderBy: {
          tanggal: 'desc',
        },
        include: {
          posyandu: {
            select: {
              id: true,
              nama_posyandu: true,
              alamat: true,
            },
          },
        },
      }),
      this.prisma.jadwal_posyandu.count({
        where: {
          posyandu_id: posyanduId,
          deleted_at: null,
          tanggal: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data: jadwalKegiatan,
      meta: {
        totalData,
        totalPage,
        currentPage: page,
        limit,
      },
    };
  }

  // ─── Comprehensive Statistics ────────────────────────────────

  async getStatistikLaporan(posyanduId: string, periode: string) {
    const dateFilter = this.buildDateFilter(periode);

    const [
      ringkasan,
      demografiJenisKelamin,
      demografiKelompokUmur,
      demografiAgama,
      demografiPendidikan,
      demografiPekerjaan,
      demografiStatusPerkawinan,
      disabilitasJenis,
      disabilitasTingkatKeparahan,
      kesehatanOdgj,
      kesehatanJenisBantuan,
      assesmenKategoriIq,
      presensiDistribusi,
      trendIbkBulanan,
      trendKegiatanBulanan,
      trendMonitoringBulanan,
      trendKehadiranBulanan,
    ] = await Promise.all([
      this.getRingkasan(posyanduId, dateFilter),
      this.getDemografiJenisKelamin(posyanduId, dateFilter),
      this.getDemografiKelompokUmur(posyanduId, dateFilter),
      this.getDemografiAgama(posyanduId, dateFilter),
      this.getDemografiPendidikan(posyanduId, dateFilter),
      this.getDemografiPekerjaan(posyanduId, dateFilter),
      this.getDemografiStatusPerkawinan(posyanduId, dateFilter),
      this.getDisabilitasJenis(posyanduId, dateFilter),
      this.getDisabilitasTingkatKeparahan(posyanduId, dateFilter),
      this.getKesehatanOdgj(posyanduId, dateFilter),
      this.getKesehatanJenisBantuan(posyanduId, dateFilter),
      this.getAssesmenKategoriIq(posyanduId, dateFilter),
      this.getPresensiDistribusi(posyanduId, dateFilter),
      this.getTrendIbkBulanan(posyanduId, dateFilter),
      this.getTrendKegiatanBulanan(posyanduId, dateFilter),
      this.getTrendMonitoringBulanan(posyanduId, dateFilter),
      this.getTrendKehadiranBulanan(posyanduId, dateFilter),
    ]);

    return {
      data: {
        ringkasan,
        demografiJenisKelamin,
        demografiKelompokUmur,
        demografiAgama,
        demografiPendidikan,
        demografiPekerjaan,
        demografiStatusPerkawinan,
        disabilitasJenis,
        disabilitasTingkatKeparahan,
        kesehatanOdgj,
        kesehatanJenisBantuan,
        assesmenKategoriIq,
        presensiDistribusi,
        trendIbkBulanan,
        trendKegiatanBulanan,
        trendMonitoringBulanan,
        trendKehadiranBulanan,
      },
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private buildDateFilter(periode: string): { gte?: Date; lte?: Date } | null {
    const now = new Date();
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    switch (periode) {
      case 'bulan_ini': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { gte: start, lte: endOfToday };
      }
      case '3_bulan': {
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return { gte: start, lte: endOfToday };
      }
      case '6_bulan': {
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return { gte: start, lte: endOfToday };
      }
      case 'tahun_ini': {
        const start = new Date(now.getFullYear(), 0, 1);
        return { gte: start, lte: endOfToday };
      }
      case 'semua':
      default:
        return null;
    }
  }

  private ibkWhereBase(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    return {
      posyanduId,
      deleted_at: null,
      ...(dateFilter ? { created_at: dateFilter } : {}),
    };
  }

  private jadwalWhereBase(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    return {
      posyandu_id: posyanduId,
      deleted_at: null,
      ...(dateFilter ? { tanggal: dateFilter } : {}),
    };
  }

  // ─── Ringkasan ───────────────────────────────────────────────

  private async getRingkasan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);
    const jadwalWhere = this.jadwalWhereBase(posyanduId, dateFilter);

    const [totalIbk, totalKegiatan, totalMonitoring, totalKader] =
      await Promise.all([
        this.prisma.ibk.count({ where: ibkWhere }),
        this.prisma.jadwal_posyandu.count({ where: jadwalWhere }),
        this.prisma.monitoring_ibk.count({
          where: {
            deleted_at: null,
            ibk: { posyanduId, deleted_at: null },
            ...(dateFilter ? { tanggal_kunjungan: dateFilter } : {}),
          },
        }),
        this.prisma.kader_posyandu.count({
          where: { posyandu_id: posyanduId, deleted_at: null },
        }),
      ]);

    // Calculate average attendance rate
    const jadwalIds = await this.prisma.jadwal_posyandu.findMany({
      where: jadwalWhere,
      select: { id: true },
    });

    let rataRataKehadiran = 0;
    if (jadwalIds.length > 0) {
      const ids = jadwalIds.map((j) => j.id);
      const [totalPresensi, totalHadir] = await Promise.all([
        this.prisma.presensi_ibk.count({
          where: {
            jadwal_id: { in: ids },
            deleted_at: null,
          },
        }),
        this.prisma.presensi_ibk.count({
          where: {
            jadwal_id: { in: ids },
            deleted_at: null,
            status_presensi: 'HADIR',
          },
        }),
      ]);
      rataRataKehadiran =
        totalPresensi > 0
          ? Math.round((totalHadir / totalPresensi) * 10000) / 100
          : 0;
    }

    return {
      totalIbk,
      totalKegiatan,
      totalMonitoring,
      totalKader,
      rataRataKehadiran,
    };
  }

  // ─── Demografi: Jenis Kelamin ────────────────────────────────

  private async getDemografiJenisKelamin(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const result = await this.prisma.ibk.groupBy({
      by: ['jenis_kelamin'],
      where: ibkWhere,
      _count: { id: true },
    });

    return result.map((r) => ({
      label: r.jenis_kelamin || 'Tidak Diketahui',
      jumlah: r._count.id,
    }));
  }

  // ─── Demografi: Kelompok Umur ────────────────────────────────

  private async getDemografiKelompokUmur(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: { umur: true },
    });

    const groups: Record<string, number> = {
      '0-5': 0,
      '6-12': 0,
      '13-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0,
      'Tidak Diketahui': 0,
    };

    for (const ibk of ibkList) {
      const umur = ibk.umur;
      if (umur == null) {
        groups['Tidak Diketahui']++;
      } else if (umur <= 5) {
        groups['0-5']++;
      } else if (umur <= 12) {
        groups['6-12']++;
      } else if (umur <= 18) {
        groups['13-18']++;
      } else if (umur <= 30) {
        groups['19-30']++;
      } else if (umur <= 45) {
        groups['31-45']++;
      } else if (umur <= 60) {
        groups['46-60']++;
      } else {
        groups['60+']++;
      }
    }

    return Object.entries(groups)
      .filter(([, jumlah]) => jumlah > 0)
      .map(([label, jumlah]) => ({ label, jumlah }));
  }

  // ─── Demografi: Agama ────────────────────────────────────────

  private async getDemografiAgama(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const result = await this.prisma.ibk.groupBy({
      by: ['agama'],
      where: ibkWhere,
      _count: { id: true },
    });

    return result.map((r) => ({
      label: r.agama || 'Tidak Diketahui',
      jumlah: r._count.id,
    }));
  }

  // ─── Demografi: Pendidikan ───────────────────────────────────

  private async getDemografiPendidikan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: {
        detail_ibk: { select: { pendidikan: true } },
      },
    });

    const counts: Record<string, number> = {};
    for (const ibk of ibkList) {
      const val = ibk.detail_ibk?.pendidikan?.trim() || 'Tidak Diketahui';
      counts[val] = (counts[val] || 0) + 1;
    }

    return Object.entries(counts).map(([label, jumlah]) => ({
      label,
      jumlah,
    }));
  }

  // ─── Demografi: Pekerjaan ────────────────────────────────────

  private async getDemografiPekerjaan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: {
        detail_ibk: { select: { pekerjaan: true } },
      },
    });

    const counts: Record<string, number> = {};
    for (const ibk of ibkList) {
      const val = ibk.detail_ibk?.pekerjaan?.trim() || 'Tidak Diketahui';
      counts[val] = (counts[val] || 0) + 1;
    }

    return Object.entries(counts).map(([label, jumlah]) => ({
      label,
      jumlah,
    }));
  }

  // ─── Demografi: Status Perkawinan ────────────────────────────

  private async getDemografiStatusPerkawinan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: {
        detail_ibk: { select: { status_perkawinan: true } },
      },
    });

    const counts: Record<string, number> = {};
    for (const ibk of ibkList) {
      const val =
        ibk.detail_ibk?.status_perkawinan?.trim() || 'Tidak Diketahui';
      counts[val] = (counts[val] || 0) + 1;
    }

    return Object.entries(counts).map(([label, jumlah]) => ({
      label,
      jumlah,
    }));
  }

  // ─── Disabilitas: Jenis ──────────────────────────────────────

  private async getDisabilitasJenis(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkIds = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: { id: true },
    });

    if (ibkIds.length === 0) return [];

    const ids = ibkIds.map((i) => i.id);

    const disabilitas = await this.prisma.disabilitas_ibk.findMany({
      where: {
        ibk_id: { in: ids },
        deleted_at: null,
      },
      include: {
        jenis_difasilitas: { select: { nama: true } },
      },
    });

    const counts: Record<string, number> = {};
    for (const d of disabilitas) {
      const nama = d.jenis_difasilitas?.nama || 'Tidak Diketahui';
      counts[nama] = (counts[nama] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([label, jumlah]) => ({ label, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);
  }

  // ─── Disabilitas: Tingkat Keparahan ──────────────────────────

  private async getDisabilitasTingkatKeparahan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkIds = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: { id: true },
    });

    if (ibkIds.length === 0) return [];

    const ids = ibkIds.map((i) => i.id);

    const disabilitas = await this.prisma.disabilitas_ibk.findMany({
      where: {
        ibk_id: { in: ids },
        deleted_at: null,
      },
      select: { tingkat_keparahan: true },
    });

    const counts: Record<string, number> = {};
    for (const d of disabilitas) {
      const val = d.tingkat_keparahan || 'Tidak Diketahui';
      counts[val] = (counts[val] || 0) + 1;
    }

    return Object.entries(counts).map(([label, jumlah]) => ({
      label,
      jumlah,
    }));
  }

  // ─── Kesehatan: ODGJ ────────────────────────────────────────

  private async getKesehatanOdgj(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: {
        kesehatan_ibk: { select: { odgj: true } },
      },
    });

    let odgj = 0;
    let nonOdgj = 0;
    let tidakDiketahui = 0;

    for (const ibk of ibkList) {
      if (ibk.kesehatan_ibk == null) {
        tidakDiketahui++;
      } else if (ibk.kesehatan_ibk.odgj) {
        odgj++;
      } else {
        nonOdgj++;
      }
    }

    return { odgj, nonOdgj, tidakDiketahui };
  }

  // ─── Kesehatan: Jenis Bantuan ────────────────────────────────

  private async getKesehatanJenisBantuan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: {
        kesehatan_ibk: { select: { jenis_bantuan: true } },
      },
    });

    const counts: Record<string, number> = {};
    for (const ibk of ibkList) {
      const val =
        ibk.kesehatan_ibk?.jenis_bantuan?.trim() ||
        'Tidak Ada / Tidak Diketahui';
      counts[val] = (counts[val] || 0) + 1;
    }

    return Object.entries(counts).map(([label, jumlah]) => ({
      label,
      jumlah,
    }));
  }

  // ─── Assesmen: Kategori IQ ──────────────────────────────────

  private async getAssesmenKategoriIq(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: {
        assesmen_ibk: { select: { kategori_iq: true } },
      },
    });

    const counts: Record<string, number> = {};
    for (const ibk of ibkList) {
      const val = ibk.assesmen_ibk?.kategori_iq?.trim() || 'Belum Dinilai';
      counts[val] = (counts[val] || 0) + 1;
    }

    return Object.entries(counts).map(([label, jumlah]) => ({
      label,
      jumlah,
    }));
  }

  // ─── Presensi: Distribusi Status ─────────────────────────────

  private async getPresensiDistribusi(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const jadwalWhere = this.jadwalWhereBase(posyanduId, dateFilter);

    const jadwalIds = await this.prisma.jadwal_posyandu.findMany({
      where: jadwalWhere,
      select: { id: true },
    });

    if (jadwalIds.length === 0) return [];

    const ids = jadwalIds.map((j) => j.id);

    const presensi = await this.prisma.presensi_ibk.groupBy({
      by: ['status_presensi'],
      where: {
        jadwal_id: { in: ids },
        deleted_at: null,
      },
      _count: { id: true },
    });

    return presensi.map((p) => ({
      label: p.status_presensi || 'Tidak Diketahui',
      jumlah: p._count.id,
    }));
  }

  // ─── Trend: IBK Baru Per Bulan ───────────────────────────────

  private async getTrendIbkBulanan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const ibkWhere = this.ibkWhereBase(posyanduId, dateFilter);

    const ibkList = await this.prisma.ibk.findMany({
      where: ibkWhere,
      select: { created_at: true },
      orderBy: { created_at: 'asc' },
    });

    return this.groupByMonth(
      ibkList.map((i) => i.created_at),
      dateFilter,
    );
  }

  // ─── Trend: Kegiatan Per Bulan ───────────────────────────────

  private async getTrendKegiatanBulanan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const jadwalWhere = this.jadwalWhereBase(posyanduId, dateFilter);

    const jadwalList = await this.prisma.jadwal_posyandu.findMany({
      where: jadwalWhere,
      select: { tanggal: true },
      orderBy: { tanggal: 'asc' },
    });

    return this.groupByMonth(
      jadwalList.map((j) => j.tanggal),
      dateFilter,
    );
  }

  // ─── Trend: Monitoring Per Bulan ─────────────────────────────

  private async getTrendMonitoringBulanan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const monitoringList = await this.prisma.monitoring_ibk.findMany({
      where: {
        deleted_at: null,
        ibk: { posyanduId, deleted_at: null },
        ...(dateFilter ? { tanggal_kunjungan: dateFilter } : {}),
      },
      select: { tanggal_kunjungan: true },
      orderBy: { tanggal_kunjungan: 'asc' },
    });

    return this.groupByMonth(
      monitoringList.map((m) => m.tanggal_kunjungan),
      dateFilter,
    );
  }

  // ─── Trend: Kehadiran Per Bulan ──────────────────────────────

  private async getTrendKehadiranBulanan(
    posyanduId: string,
    dateFilter: { gte?: Date; lte?: Date } | null,
  ) {
    const jadwalWhere = this.jadwalWhereBase(posyanduId, dateFilter);

    const jadwalList = await this.prisma.jadwal_posyandu.findMany({
      where: jadwalWhere,
      select: {
        id: true,
        tanggal: true,
      },
      orderBy: { tanggal: 'asc' },
    });

    if (jadwalList.length === 0) return [];

    const ids = jadwalList.map((j) => j.id);

    const presensiAll = await this.prisma.presensi_ibk.findMany({
      where: {
        jadwal_id: { in: ids },
        deleted_at: null,
      },
      select: {
        status_presensi: true,
        jadwal_id: true,
      },
    });

    // Build a map from jadwal_id → tanggal
    const jadwalTanggalMap = new Map<string, Date | null>();
    for (const j of jadwalList) {
      jadwalTanggalMap.set(j.id, j.tanggal);
    }

    // Group presensi by month
    const monthMap = new Map<string, { hadir: number; total: number }>();

    for (const p of presensiAll) {
      const tanggal = jadwalTanggalMap.get(p.jadwal_id);
      if (!tanggal) continue;
      const key = this.toMonthKey(tanggal);
      if (!monthMap.has(key)) {
        monthMap.set(key, { hadir: 0, total: 0 });
      }
      const entry = monthMap.get(key)!;
      entry.total++;
      if (p.status_presensi === 'HADIR') {
        entry.hadir++;
      }
    }

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([bulan, { hadir, total }]) => ({
        bulan,
        hadir,
        tidakHadir: total - hadir,
        total,
        persentase: total > 0 ? Math.round((hadir / total) * 10000) / 100 : 0,
      }));
  }

  // ─── Utility: Group dates by month ───────────────────────────

  private toMonthKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private groupByMonth(
    dates: (Date | null | undefined)[],
    dateFilter: { gte?: Date; lte?: Date } | null,
  ): { bulan: string; jumlah: number }[] {
    const counts: Record<string, number> = {};

    // If there's a date filter, pre-populate all months in range with 0
    if (dateFilter?.gte && dateFilter?.lte) {
      const start = new Date(dateFilter.gte);
      const end = new Date(dateFilter.lte);
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end) {
        const key = this.toMonthKey(cursor);
        counts[key] = 0;
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    for (const d of dates) {
      if (!d) continue;
      const key = this.toMonthKey(d);
      counts[key] = (counts[key] || 0) + 1;
    }

    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([bulan, jumlah]) => ({ bulan, jumlah }));
  }
}
