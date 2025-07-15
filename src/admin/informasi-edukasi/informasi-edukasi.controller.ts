import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InformasiEdukasiService } from './informasi-edukasi.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { InformasiEdukasiDto } from 'src/dto/informasi-edukasi';

@Controller('/admin/informasi-edukasi')
export class InformasiEdukasiController {
  constructor(
    private readonly informasiEdukasiService: InformasiEdukasiService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  async createInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.informasiEdukasiService.createInformasiEdukasi(data, userId);
  }

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
}
