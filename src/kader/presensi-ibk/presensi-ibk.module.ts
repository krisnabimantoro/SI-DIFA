import { Module } from '@nestjs/common';
import { PresensiIbkService } from './presensi-ibk.service';
import { PresensiIbkController } from './presensi-ibk.controller';

@Module({
  controllers: [PresensiIbkController],
  providers: [PresensiIbkService],
})
export class PresensiIbkModule {}
