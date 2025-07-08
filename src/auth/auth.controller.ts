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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup/posyandu')
  async signUp(@Body() signUpPosyanduDto: RegisterPosyanduDto) {
    return this.authService.registerPosyandu(signUpPosyanduDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/psikolog')
  signUpPsikolog(@Body() signUpPsikologDto: RegisterPsikologDto) {
    return this.authService.registerPsikolog(signUpPsikologDto);
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
}
