import { Module } from '@nestjs/common';
import { MonitoringIbkService } from './monitoring-ibk.service';
import { MonitoringIbkController } from './monitoring-ibk.controller';

@Module({
  controllers: [MonitoringIbkController],
  providers: [MonitoringIbkService],
})
export class MonitoringIbkModule {}
