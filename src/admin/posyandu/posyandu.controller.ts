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
} from '@nestjs/common';
import { PosyanduService } from './posyandu.service';
import { CreatePosyanduDto } from './dto/create-posyandu.dto';
import { UpdatePosyanduDto } from './dto/update-posyandu.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('posyandu')
export class PosyanduController {
  constructor(private readonly posyanduService: PosyanduService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createPosyanduDto: CreatePosyanduDto, @Req() req: any) {
    const userId = req.user.id;
    return this.posyanduService.create(createPosyanduDto, userId);
  }

  @Get()
  findAll() {
    return this.posyanduService.findAll();
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
