import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('kader/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getDashboardStats(@Query('posyandu_id') posyanduId: string) {
    return this.dashboardService.getDashboardStats(posyanduId);
  }

  @Get('kunjungan-bulan-ini')
  getKunjunganBulanIni(
    @Query('posyandu_id') posyanduId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getKunjunganBulanIni(
      posyanduId,
      pageNumber,
      limitNumber,
    );
  }
}
