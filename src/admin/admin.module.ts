import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { LowonganController } from './lowongan/lowongan.controller';
import { LowonganModule } from './lowongan/lowongan.module';

@Module({
  providers: [AdminService, UsersService, PrismaService],
  controllers: [LowonganController],
  imports: [LowonganModule],
})
export class AdminModule {}
