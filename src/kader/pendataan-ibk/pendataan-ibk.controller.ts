import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { PendataanIbkService } from './pendataan-ibk.service';
import { CreatePendataanIbkDto } from './dto/create-pendataan-ibk.dto';
import { UpdatePendataanIbkDto } from './dto/update-pendataan-ibk.dto';
import { IbkDto } from './dto/ibk.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express/multer/interceptors';
import { KesehatanIbkDto } from './dto/kesehatan-ibk.dto';
import { DetailIbkDto } from './dto/detail-ibk.dto';
import { AssesmenIbkDto } from './dto/assesmen-ibk.dto';

@Controller('kader/pendataan-ibk')
export class PendataanIbkController {
  constructor(private readonly pendataanIbkService: PendataanIbkService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader', 'admin')
  @UseInterceptors(NoFilesInterceptor())
  @Post()
  create(
    @Body() dataIbk: IbkDto,
    @Body() dataKesehatan: KesehatanIbkDto,
    @Body() dataDetailIbk: DetailIbkDto,
    @Body() dataAssesment: AssesmenIbkDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.pendataanIbkService.create(
      { user_id: userId },
      dataIbk,
      dataKesehatan,
      dataDetailIbk,
      dataAssesment,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader', 'admin')
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, any>,
    @Query('orderBy') orderBy?: string,
  ): Promise<any> {
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
    return this.pendataanIbkService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
  }
}
