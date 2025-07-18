import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PendataanIbkService } from './pendataan-ibk.service';
import { CreatePendataanIbkDto } from './dto/create-pendataan-ibk.dto';
import { UpdatePendataanIbkDto } from './dto/update-pendataan-ibk.dto';

@Controller('pendataan-ibk')
export class PendataanIbkController {
  constructor(private readonly pendataanIbkService: PendataanIbkService) {}

  @Post()
  create(@Body() createPendataanIbkDto: CreatePendataanIbkDto) {
    return this.pendataanIbkService.create(createPendataanIbkDto);
  }

  @Get()
  findAll() {
    return this.pendataanIbkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pendataanIbkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePendataanIbkDto: UpdatePendataanIbkDto) {
    return this.pendataanIbkService.update(+id, updatePendataanIbkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pendataanIbkService.remove(+id);
  }
}
