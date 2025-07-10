import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AdminService, UsersService, PrismaService],
})
export class AdminModule {}
