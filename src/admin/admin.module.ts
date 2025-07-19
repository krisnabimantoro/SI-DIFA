import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { LowonganController } from './lowongan/lowongan.controller';
import { LowonganModule } from './lowongan/lowongan.module';
import { InformasiEdukasiController } from './informasi-edukasi/informasi-edukasi.controller';
import { InformasiEdukasiService } from './informasi-edukasi/informasi-edukasi.service';
import { InformasiEdukasiModule } from './informasi-edukasi/informasi-edukasi.module';
import { PosyanduModule } from './posyandu/posyandu.module';
import { PosyanduService } from './posyandu/posyandu.service';
import { lowongan } from '@prisma/client';
import { AdminController } from './admin.controller';

@Module({
  providers: [AdminService, UsersService, PrismaService],
  controllers: [AdminController],
  imports: [LowonganModule, InformasiEdukasiModule, PosyanduModule],
  exports: [
    PrismaService,
    PosyanduModule,
    InformasiEdukasiModule,
    LowonganModule,
  ],
})
export class AdminModule {}
