import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LowonganService } from '../../admin/lowongan/lowongan.service';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/lowongan-kader')
export class LowonganKaderController {
  constructor(private readonly lowonganService: LowonganService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('kader')
  async getAllLowongan(
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
    return this.lowonganService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      page: parseInt(page) || 1,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('detail/:id')
  @Roles('kader')
  async getLowongan(@Param('id') id: string): Promise<any> {
    return this.lowonganService.findOne({ id });
  }
}
