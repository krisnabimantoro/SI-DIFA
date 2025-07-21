import { Module } from '@nestjs/common';
import { PendataanIbkService } from './pendataan-ibk.service';
import { PendataanIbkController } from './pendataan-ibk.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PendataanIbkController],
  providers: [PendataanIbkService,PrismaService],
})
export class PendataanIbkModule {}
