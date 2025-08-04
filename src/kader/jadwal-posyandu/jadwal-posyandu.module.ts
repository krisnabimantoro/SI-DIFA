import { Module } from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { JadwalPosyanduController } from './jadwal-posyandu.controller';

@Module({
  controllers: [JadwalPosyanduController],
  providers: [JadwalPosyanduService],
})
export class JadwalPosyanduModule {}
