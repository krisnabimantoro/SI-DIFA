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
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.pendataanIbkService.create(
      { user_id: userId },
      dataIbk,
      dataKesehatan,
      dataDetailIbk,
    );
  }
}
