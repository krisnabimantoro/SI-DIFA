import { Module } from '@nestjs/common';
import { PresensiIbkService } from './presensi-ibk.service';
import { PresensiIbkController } from './presensi-ibk.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PresensiIbkController],
  providers: [PresensiIbkService, PrismaService],
})
export class PresensiIbkModule {}
