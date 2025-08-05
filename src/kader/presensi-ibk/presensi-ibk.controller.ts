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
import { PresensiIbkService } from './presensi-ibk.service';
import { CreatePresensiIbkDto } from './dto/create-presensi-ibk.dto';
import { UpdatePresensiIbkDto } from './dto/update-presensi-ibk.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/presensi-ibk')
export class PresensiIbkController {
  constructor(private readonly presensiIbkService: PresensiIbkService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('kader', 'admin')
  async createPresensiIbk(
    @Body() createPresensiIbkDto: CreatePresensiIbkDto,
  ): Promise<any> {
    return this.presensiIbkService.create(createPresensiIbkDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:jadwalId')
  @Roles('kader', 'admin')
  async getAllPresensiIbk(
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

    return this.presensiIbkService.findAll({
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
  async getPresensiIbk(@Param('id') id: string): Promise<any> {
    return this.presensiIbkService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  @Roles('kader', 'admin')
  async updatePresensiIbk(
    @Param('id') id: string,
    @Body() updatePresensiIbkDto: UpdatePresensiIbkDto,
  ): Promise<any> {
    return this.presensiIbkService.update({ id }, updatePresensiIbkDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/bulk-update/:jadwalId')
  @Roles('kader', 'admin')
  async bulkUpdatePresensiIbk(
    @Param('jadwalId') jadwalId: string,
    @Body() updates: { user_ibk_id: string; status_presensi: string }[],
  ): Promise<any> {
    return this.presensiIbkService.bulkUpdateStatus(jadwalId, updates);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @Roles('kader', 'admin')
  async deletePresensiIbk(@Param('id') id: string): Promise<any> {
    await this.presensiIbkService.remove({ id });
    return {
      message: 'Presensi IBK deleted successfully',
    };
  }
}
