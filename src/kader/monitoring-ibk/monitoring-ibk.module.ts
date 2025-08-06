import { Module } from '@nestjs/common';
import { MonitoringIbkService } from './monitoring-ibk.service';
import { MonitoringIbkController } from './monitoring-ibk.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MonitoringIbkController],
  providers: [MonitoringIbkService, PrismaService],
})
export class MonitoringIbkModule {}
