import { Module } from '@nestjs/common';
import { PresensiKaderService } from './presensi-kader.service';
import { PresensiKaderController } from './presensi-kader.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PresensiKaderController],
  providers: [PresensiKaderService, PrismaService],
})
export class PresensiKaderModule {}
