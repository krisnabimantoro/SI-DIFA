import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InformasiEdukasiService } from './informasi-edukasi.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { InformasiEdukasiDto } from 'src/dto/informasi-edukasi';

@Controller('/admin/informasi-edukasi')
export class InformasiEdukasiController {
  constructor(
    private readonly informasiEdukasiService: InformasiEdukasiService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  async createInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.informasiEdukasiService.createInformasiEdukasi(data, userId);
  }
}
