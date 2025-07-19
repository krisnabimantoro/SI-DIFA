import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InformasiEdukasiService } from '../../admin/informasi-edukasi/informasi-edukasi.service';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('kader/informasi-edukasi-kader')
export class InformasiEdukasiKaderController {
  constructor(
    private readonly informasiEdukasiService: InformasiEdukasiService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async getAllInformasiEdukasi(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, any>,
  ): Promise<any> {
    const pageNumber = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit) || 10;
    const { page: _p, limit: _l, orderBy: _o, sort: _s, ...filter } = query;

    const modifiedFilter = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = { contains: value, mode: 'insensitive' };
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    return this.informasiEdukasiService.getAllInformasiEdukasi({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('detail/:id')
  @Roles('admin')
  async getInformasiEdulasi(@Param('id') id: string): Promise<any> {
    return this.informasiEdukasiService.getInformasiEdukasi({ id });
  }
}
