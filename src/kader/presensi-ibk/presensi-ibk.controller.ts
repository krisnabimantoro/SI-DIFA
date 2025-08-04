import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresensiIbkService } from './presensi-ibk.service';
import { CreatePresensiIbkDto } from './dto/create-presensi-ibk.dto';
import { UpdatePresensiIbkDto } from './dto/update-presensi-ibk.dto';

@Controller('presensi-ibk')
export class PresensiIbkController {
  constructor(private readonly presensiIbkService: PresensiIbkService) {}

  @Post()
  create(@Body() createPresensiIbkDto: CreatePresensiIbkDto) {
    return this.presensiIbkService.create(createPresensiIbkDto);
  }

  @Get()
  findAll() {
    return this.presensiIbkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presensiIbkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresensiIbkDto: UpdatePresensiIbkDto) {
    return this.presensiIbkService.update(+id, updatePresensiIbkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presensiIbkService.remove(+id);
  }
}
