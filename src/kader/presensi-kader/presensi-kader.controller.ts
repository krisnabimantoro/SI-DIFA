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
  Query,
} from '@nestjs/common';
import { PresensiKaderService } from './presensi-kader.service';
import { CreatePresensiKaderDto } from './dto/create-presensi-kader.dto';
import { UpdatePresensiKaderDto } from './dto/update-presensi-kader.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/presensi-kader')
export class PresensiKaderController {
  constructor(private readonly presensiKaderService: PresensiKaderService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('kader', 'admin')
  async createPresensiKader(
    @Body() createPresensiKaderDto: CreatePresensiKaderDto,
  ): Promise<any> {
    return this.presensiKaderService.create(createPresensiKaderDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:jadwalId')
  @Roles('kader', 'admin')
  async getAllPresensiKader(
    @Query() query: Record<string, any>,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Param('jadwalId') jadwalId?: string,
  ): Promise<any> {
    const pageNumber = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit) || 10;
    const {
      page: _p,
      limit: _l,
      orderBy: _o,
      sort: _s,
      jadwalId: _jid,
      ...filter
    } = query;

    const modifiedFilter = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string' && ['status_presensi'].includes(key)) {
          acc[key] = { contains: value, mode: 'insensitive' };
        } else if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    return this.presensiKaderService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      jadwalId,
      orderBy: { created_at: 'desc' },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/detail/:id')
  @Roles('kader', 'admin')
  async getPresensiKader(@Param('id') id: string): Promise<any> {
    return this.presensiKaderService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/kader-not-registered/:jadwalId/posyandu/:posyanduId')
  @Roles('kader', 'admin')
  async getKaderNotRegistered(
    @Param('jadwalId') jadwalId: string,
    @Param('posyanduId') posyanduId: string,
  ): Promise<any> {
    return this.presensiKaderService.findKaderNotRegistered({
      jadwalId,
      posyanduId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  @Roles('kader', 'admin')
  async updatePresensiKader(
    @Param('id') id: string,
    @Body() updatePresensiKaderDto: UpdatePresensiKaderDto,
  ): Promise<any> {
    return this.presensiKaderService.update({ id }, updatePresensiKaderDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/bulk-update/:jadwalId')
  @Roles('kader', 'admin')
  async bulkUpdatePresensiKader(
    @Param('jadwalId') jadwalId: string,
    @Body() updates: { user_kader_id: string; status_presensi: string }[],
  ): Promise<any> {
    return this.presensiKaderService.bulkUpdateStatus(jadwalId, updates);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @Roles('kader', 'admin')
  async deletePresensiKader(@Param('id') id: string): Promise<any> {
    await this.presensiKaderService.remove({ id });
    return {
      message: 'Presensi Kader deleted successfully',
    };
  }
}
