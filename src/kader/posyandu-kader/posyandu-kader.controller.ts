import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PosyanduService } from 'src/admin/posyandu/posyandu.service';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('kader/posyandu')
export class PosyanduKaderController {
  constructor(private readonly posyanduService: PosyanduService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader', 'admin')
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, any>,
    @Query('orderBy') orderBy?: string,
  ) {
    const pageNumber = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit);
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

    return this.posyanduService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader','admin')
  @Get('detail')
  findOne(@Body('id') id: string) {
    return this.posyanduService.findOne({ id });
  }

  
}
