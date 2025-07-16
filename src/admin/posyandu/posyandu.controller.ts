import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PosyanduService } from './posyandu.service';
import { CreatePosyanduDto } from './dto/create-posyandu.dto';
import { UpdatePosyanduDto } from './dto/update-posyandu.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('admin/posyandu')
export class PosyanduController {
  constructor(private readonly posyanduService: PosyanduService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createPosyanduDto: CreatePosyanduDto, @Req() req: any) {
    const userId = req.user.id;
    return this.posyanduService.create(createPosyanduDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posyanduService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePosyanduDto: UpdatePosyanduDto,
  ) {
    return this.posyanduService.update(+id, updatePosyanduDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posyanduService.remove(+id);
  }
}
