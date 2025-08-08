import { Module } from '@nestjs/common';
import { PresensiKaderService } from './presensi-kader.service';
import { PresensiKaderController } from './presensi-kader.controller';

@Module({
  controllers: [PresensiKaderController],
  providers: [PresensiKaderService],
})
export class PresensiKaderModule {}
