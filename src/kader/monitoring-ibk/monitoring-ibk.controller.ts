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
  Req,
} from '@nestjs/common';
import { MonitoringIbkService } from './monitoring-ibk.service';
import { CreateMonitoringIbkDto } from './dto/create-monitoring-ibk.dto';
import { UpdateMonitoringIbkDto } from './dto/update-monitoring-ibk.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/monitoring-ibk')
export class MonitoringIbkController {
  constructor(private readonly monitoringIbkService: MonitoringIbkService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('kader', 'admin')
  async createMonitoringIbk(
    @Body() createMonitoringIbkDto: CreateMonitoringIbkDto,
    @Req() req: any,
  ): Promise<any> {
    // Get user kader ID from authenticated user if not provided
    const userKaderId = req.user.id;

    const monitoringData = {
      ...createMonitoringIbkDto,
      users_kader_id: userKaderId,
    };

    return this.monitoringIbkService.create(monitoringData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:jadwalId')
  @Roles('kader', 'admin')
  async getAllMonitoringIbk(
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
      ibkId: _iid,
      kaderId: _kid,
      ...filter
    } = query;

    const modifiedFilter = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        if (
          typeof value === 'string' &&
          [
            'keluhan',
            'perilaku_baru',
            'tindak_lanjut',
            'kecamatan',
            'keterangan',
          ].includes(key)
        ) {
          acc[key] = { contains: value, mode: 'insensitive' };
        } else if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    return this.monitoringIbkService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      jadwalId,
      orderBy: { created_at: 'desc' },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/ibk/:ibkId')
  @Roles('kader', 'admin')
  async getMonitoringByIbk(@Param('ibkId') ibkId: string): Promise<any> {
    return this.monitoringIbkService.findByIbk(ibkId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/detail/:id')
  @Roles('kader', 'admin')
  async getMonitoringIbk(@Param('id') id: string): Promise<any> {
    return this.monitoringIbkService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  @Roles('kader', 'admin')
  async updateMonitoringIbk(
    @Param('id') id: string,
    @Body() updateMonitoringIbkDto: UpdateMonitoringIbkDto,
  ): Promise<any> {
    return this.monitoringIbkService.update({ id }, updateMonitoringIbkDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/list-hadir/:jadwalId')
  @Roles('kader', 'admin')
  async getListHadirIbk(@Param('jadwalId') jadwalId: string): Promise<any> {
    return this.monitoringIbkService.getListIbkPresensi({ jadwalId });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @Roles('kader', 'admin')
  async deleteMonitoringIbk(@Param('id') id: string): Promise<any> {
    await this.monitoringIbkService.remove({ id });
    return {
      message: 'Monitoring IBK deleted successfully',
    };
  }
}
