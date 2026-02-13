import { Module } from '@nestjs/common';
import { KaderService } from './kader.service';
import { KaderController } from './kader.controller';
import { PosyanduKaderModule } from './posyandu-kader/posyandu-kader.module';
import { AdminModule } from 'src/admin/admin.module';
import { PendataanIbkModule } from './pendataan-ibk/pendataan-ibk.module';
import { InformasiEdukasiKaderModule } from './informasi-edukasi-kader/informasi-edukasi-kader.module';
import { LowonganKaderModule } from './lowongan-kader/lowongan-kader.module';
import { MonitoringIbkModule } from './monitoring-ibk/monitoring-ibk.module';
import { JadwalPosyanduModule } from './jadwal-posyandu/jadwal-posyandu.module';
import { PresensiIbkModule } from './presensi-ibk/presensi-ibk.module';
import { PresensiKaderModule } from './presensi-kader/presensi-kader.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  controllers: [KaderController],
  providers: [KaderService],
  imports: [PosyanduKaderModule, AdminModule, PendataanIbkModule, InformasiEdukasiKaderModule, LowonganKaderModule, MonitoringIbkModule, JadwalPosyanduModule, PresensiIbkModule, PresensiKaderModule, ProfileModule, DashboardModule],
})
export class KaderModule {}
