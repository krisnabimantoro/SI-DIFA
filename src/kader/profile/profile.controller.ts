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
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('/kader/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader')
  @Get('/detail')
  async findOne(@Req() req: any) {
    const userId = await req.user.id;
    return this.profileService.findOne({ id: userId });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('kader')
  @Patch('/update')
  async update(@Body() updateProfileDto: UpdateProfileDto, @Req() req: any) {
    const userId = await req.user.id;
    return this.profileService.update({ id: userId }, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
