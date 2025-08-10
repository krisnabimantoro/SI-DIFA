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
  BadRequestException,
} from '@nestjs/common';
import { DisabilitasIbkService } from './disabilitas-ibk.service';
import {
  CreateDisabilitasIbkDto,
  BulkCreateDisabilitasIbkDto,
} from './dto/create-disabilitas-ibk.dto';
import { UpdateDisabilitasIbkDto } from './dto/update-disabilitas-ibk.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/pendataan-ibk/disabilitas-ibk')
export class DisabilitasIbkController {
  constructor(private readonly disabilitasIbkService: DisabilitasIbkService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('kader', 'admin')
  async createDisabilitasIbk(
    @Body() createDisabilitasIbkDto: CreateDisabilitasIbkDto,
  ): Promise<any> {
    try {
      const result = await this.disabilitasIbkService.create(
        createDisabilitasIbkDto,
      );
      return {
        message: 'Disabilitas IBK created successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create disabilitas IBK: ${error.message}`,
      );
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/bulk')
  @Roles('kader', 'admin')
  async bulkCreateDisabilitasIbk(
    @Body() bulkCreateDisabilitasIbkDto: BulkCreateDisabilitasIbkDto,
  ): Promise<any> {
    try {
      const result = await this.disabilitasIbkService.bulkCreate(
        bulkCreateDisabilitasIbkDto,
      );
      return {
        message: `Successfully created ${result.count} disabilitas IBK records`,
        count: result.count,
        data: result.data,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to bulk create disabilitas IBK: ${error.message}`,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('kader', 'admin')
  async getAllDisabilitasIbk(
    @Query() query: Record<string, any>,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<any> {
    const pageNumber = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit) || 10;
    const {
      page: _p,
      limit: _l,
      orderBy: _o,
      sort: _s,
      ibkId,
      jenisDisabilitasId,
      ...filter
    } = query;

    const modifiedFilter = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        if (
          typeof value === 'string' &&
          ['tingkat_keparahan', 'keterangan'].includes(key)
        ) {
          acc[key] = { contains: value, mode: 'insensitive' };
        } else if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    return this.disabilitasIbkService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      ibkId,
      jenisDisabilitasId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/detail/:id')
  @Roles('kader', 'admin')
  async getDisabilitasIbk(@Param('id') id: string): Promise<any> {
    return this.disabilitasIbkService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/ibk/:ibkId')
  @Roles('kader', 'admin')
  async getDisabilitasByIbk(@Param('ibkId') ibkId: string): Promise<any> {
    return this.disabilitasIbkService.findByIbk(ibkId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/jenis/:jenisDisabilitasId')
  @Roles('kader', 'admin')
  async getDisabilitasByJenis(
    @Param('jenisDisabilitasId') jenisDisabilitasId: string,
  ): Promise<any> {
    return this.disabilitasIbkService.findByJenisDisabilitas(
      jenisDisabilitasId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/jenis-disabilitas/list')
  @Roles('kader', 'admin')
  async getAllJenisDisabilitas(): Promise<any> {
    return this.disabilitasIbkService.getAllJenisDisabilitas();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  @Roles('kader', 'admin')
  async updateDisabilitasIbk(
    @Param('id') id: string,
    @Body() updateDisabilitasIbkDto: UpdateDisabilitasIbkDto,
  ): Promise<any> {
    return this.disabilitasIbkService.update({ id }, updateDisabilitasIbkDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @Roles('kader', 'admin')
  async deleteDisabilitasIbk(@Param('id') id: string): Promise<any> {
    await this.disabilitasIbkService.remove({ id });
    return {
      message: 'Disabilitas IBK deleted successfully',
    };
  }
}
