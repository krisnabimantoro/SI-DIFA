import {
  Body,
  Param,
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PosyanduService } from 'src/admin/posyandu/posyandu.service';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { PosyanduKaderService } from './posyandu-kader.service';

@Controller('kader/posyandu')
export class PosyanduKaderController {
  constructor(
    private readonly posyanduService: PosyanduService,
    private readonly posyanduKaderService: PosyanduKaderService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader', 'admin')
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, any>,
    @Query('orderBy') orderBy?: string,
    @Req() req?: any,
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

    const userId = await req?.user?.id;
    return this.posyanduKaderService.findAll(
      { user_id: userId },
      {
        skip: pageNumber,
        take: limitNumber,
        where: modifiedFilter,
        orderBy: orderBy ? JSON.parse(orderBy) : undefined,
      },
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader', 'admin')
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.posyanduService.findOne({ id });
  }
}
