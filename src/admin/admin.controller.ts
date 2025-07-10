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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { Roles } from 'src/lib/role-guard/roles.decorator';
import { RolesGuard } from 'src/lib/role-guard/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('verification')
  @Roles('admin', 'posyandu')
  async verificationUser(
    @Body()
    { userId, verification }: { userId: string; verification: string },
    @Request() req,
  ): Promise<void> {
    console.log('User verification request:', req.user);
    return await this.adminService.verificationUser(userId, verification);
  }
}
