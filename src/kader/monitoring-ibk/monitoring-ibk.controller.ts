import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonitoringIbkService } from './monitoring-ibk.service';
import { CreateMonitoringIbkDto } from './dto/create-monitoring-ibk.dto';
import { UpdateMonitoringIbkDto } from './dto/update-monitoring-ibk.dto';

@Controller('monitoring-ibk')
export class MonitoringIbkController {
  constructor(private readonly monitoringIbkService: MonitoringIbkService) {}

  @Post()
  create(@Body() createMonitoringIbkDto: CreateMonitoringIbkDto) {
    return this.monitoringIbkService.create(createMonitoringIbkDto);
  }

  @Get()
  findAll() {
    return this.monitoringIbkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoringIbkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoringIbkDto: UpdateMonitoringIbkDto) {
    return this.monitoringIbkService.update(+id, updateMonitoringIbkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoringIbkService.remove(+id);
  }
}
