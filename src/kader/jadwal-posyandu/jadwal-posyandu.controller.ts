import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';

@Controller('jadwal-posyandu')
export class JadwalPosyanduController {
  constructor(private readonly jadwalPosyanduService: JadwalPosyanduService) {}

  @Post()
  create(@Body() createJadwalPosyanduDto: CreateJadwalPosyanduDto) {
    return this.jadwalPosyanduService.create(createJadwalPosyanduDto);
  }

  @Get()
  findAll() {
    return this.jadwalPosyanduService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jadwalPosyanduService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJadwalPosyanduDto: UpdateJadwalPosyanduDto) {
    return this.jadwalPosyanduService.update(+id, updateJadwalPosyanduDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jadwalPosyanduService.remove(+id);
  }
}
