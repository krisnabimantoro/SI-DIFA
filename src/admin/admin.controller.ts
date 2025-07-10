import {
  Body,
  Controller,
  Get,
  HttpCode,
  Request,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { Roles } from 'src/lib/role-guard/roles.decorator';
import { RolesGuard } from 'src/lib/role-guard/roles.guard';

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
}
