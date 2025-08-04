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

@Module({
  controllers: [KaderController],
  providers: [KaderService],
  imports: [PosyanduKaderModule, AdminModule, PendataanIbkModule, InformasiEdukasiKaderModule, LowonganKaderModule, MonitoringIbkModule, JadwalPosyanduModule],
})
export class KaderModule {}
