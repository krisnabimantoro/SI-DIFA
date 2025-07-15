import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InformasiEdukasiService } from './informasi-edukasi.service';
import { InformasiEdukasiController } from './informasi-edukasi.controller';

@Module({
  providers: [PrismaService, InformasiEdukasiService],
  controllers: [InformasiEdukasiController],
})
export class InformasiEdukasiModule {}
