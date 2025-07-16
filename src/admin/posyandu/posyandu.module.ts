import { Module } from '@nestjs/common';
import { PosyanduService } from './posyandu.service';
import { PosyanduController } from './posyandu.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PosyanduController],
  providers: [PosyanduService,PrismaService],
})
export class PosyanduModule {}
