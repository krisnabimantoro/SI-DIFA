import {
  Body,
  Controller,
  Get,
  HttpCode,
  Request,
  HttpStatus,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('verification')
  @Roles('admin')
  async verificationUser(
    @Body()
    { userId, verification }: { userId: string; verification: string },
    @Request() req,
  ): Promise<void> {
    return await this.adminService.verificationUser(userId, verification);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('list-user')
  @Roles('admin')
  async listUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() query: Record<string, any>,
  ): Promise<any> {
    const { page: p, limit: l, ...filter } = query;
    return await this.adminService.listUser(Number(p), Number(l), filter);
  }
}
