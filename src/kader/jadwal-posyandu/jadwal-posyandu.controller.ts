import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/jadwal-posyandu')
export class JadwalPosyanduController {
  constructor(private readonly jadwalPosyanduService: JadwalPosyanduService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('kader')
  async createLowongan(@Body() data: CreateJadwalPosyanduDto): Promise<any> {
    return this.jadwalPosyanduService.create(data.posyandu_id, data);
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
  update(
    @Param('id') id: string,
    @Body() updateJadwalPosyanduDto: UpdateJadwalPosyanduDto,
  ) {
    return this.jadwalPosyanduService.update(+id, updateJadwalPosyanduDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jadwalPosyanduService.remove(+id);
  }
}
