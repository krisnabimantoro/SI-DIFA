import { Controller, Get, Param } from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';

@Controller('ibk/jadwal-posyandu')
export class JadwalPosyanduController {
  constructor(private readonly jadwalPosyanduService: JadwalPosyanduService) {}

  /**
   * Get latest jadwal posyandu for IBK by their NIK
   * GET /ibk/jadwal-posyandu/by-nik/:nik
   */
  @Get('/:nik')
  getLatestByNik(@Param('nik') nik: string) {
    return this.jadwalPosyanduService.getLatestJadwalByNik(nik);
  }
}
