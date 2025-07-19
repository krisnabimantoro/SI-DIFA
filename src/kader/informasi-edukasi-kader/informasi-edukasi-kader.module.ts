import { Module } from '@nestjs/common';
import { InformasiEdukasiKaderController } from './informasi-edukasi-kader.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [InformasiEdukasiKaderController],
})
export class InformasiEdukasiKaderModule {}
