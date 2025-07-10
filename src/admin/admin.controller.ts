import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch('verification')
  async verificationUser(
    @Body()
    { userId, verification }: { userId: string; verification: string },
  ): Promise<void> {
    return await this.adminService.verificationUser(userId, verification);
  }
}
