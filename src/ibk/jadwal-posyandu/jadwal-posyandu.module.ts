import { Module } from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { JadwalPosyanduController } from './jadwal-posyandu.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [JadwalPosyanduController],
  providers: [JadwalPosyanduService, PrismaService],
})
export class JadwalPosyanduModule {}
