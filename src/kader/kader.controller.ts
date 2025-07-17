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
import { KaderService } from './kader.service';
import { CreateKaderDto } from './dto/create-kader.dto';
import { UpdateKaderDto } from './dto/update-kader.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { KaderPosyanduDto } from './dto/kader-posyandu';

@Controller('kader')
export class KaderController {
  constructor(private readonly kaderService: KaderService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader')
  @Post('register-kader-posyandu')
  async registerKaderPosyandu(@Body() data: KaderPosyanduDto, @Req() req: any) {
    const userId = await req.user.id;
    return await this.kaderService.registerKaderPosyandu(
      { user_id: userId }, // usersWhereInput
      {
        posyandu_id: data.posyandu_id,
      },
    );
  }
}
