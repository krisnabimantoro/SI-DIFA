import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('jadwal-kegiatan')
  getJadwalKegiatan(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getJadwalKegiatan(pageNumber, limitNumber);
  }

  @Get('kader-need-verification')
  getKaderNeedVerification(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getKaderNeedVerification(
      pageNumber,
      limitNumber,
    );
  }
}
