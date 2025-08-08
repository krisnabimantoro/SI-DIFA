import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresensiKaderService } from './presensi-kader.service';
import { CreatePresensiKaderDto } from './dto/create-presensi-kader.dto';
import { UpdatePresensiKaderDto } from './dto/update-presensi-kader.dto';

@Controller('presensi-kader')
export class PresensiKaderController {
  constructor(private readonly presensiKaderService: PresensiKaderService) {}

  @Post()
  create(@Body() createPresensiKaderDto: CreatePresensiKaderDto) {
    return this.presensiKaderService.create(createPresensiKaderDto);
  }

  @Get()
  findAll() {
    return this.presensiKaderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presensiKaderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresensiKaderDto: UpdatePresensiKaderDto) {
    return this.presensiKaderService.update(+id, updatePresensiKaderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presensiKaderService.remove(+id);
  }
}
