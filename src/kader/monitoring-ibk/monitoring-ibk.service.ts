import { Injectable } from '@nestjs/common';
import { CreateMonitoringIbkDto } from './dto/create-monitoring-ibk.dto';
import { UpdateMonitoringIbkDto } from './dto/update-monitoring-ibk.dto';

@Injectable()
export class MonitoringIbkService {
  create(createMonitoringIbkDto: CreateMonitoringIbkDto) {
    return 'This action adds a new monitoringIbk';
  }

  findAll() {
    return `This action returns all monitoringIbk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitoringIbk`;
  }

  update(id: number, updateMonitoringIbkDto: UpdateMonitoringIbkDto) {
    return `This action updates a #${id} monitoringIbk`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitoringIbk`;
  }
}
