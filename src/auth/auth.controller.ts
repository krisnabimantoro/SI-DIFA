import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPosyanduDto } from './dto/register-posyandu.dto';
import { RegisterPsikologDto } from './dto/register-psikolog.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth-guard';
import { LocalAuthGuard } from './guard/local-auth-guard';
import { Throttle } from '@nestjs/throttler';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup/posyandu')
  async signUp(
    @Body() userDto: UserDto,
    @Body() signUpPosyanduDto: RegisterPosyanduDto,
  ) {
    return this.authService.registerPosyandu(signUpPosyanduDto, userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/psikolog')
  signUpPsikolog(
    @Body() userDto: UserDto,
    @Body() signUpPsikologDto: RegisterPsikologDto,
  ) {
    return this.authService.registerPsikolog(signUpPsikologDto, userDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() { token, password }: { token: string; password: string },
  ): Promise<void> {
    return this.authService.resetPassword(token, password);
  }
}
