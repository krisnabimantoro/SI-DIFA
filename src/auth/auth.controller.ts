import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPosyanduDto } from './dto/register-posyandu.dto';
import { RegisterPsikologDto } from './dto/register-psikolog.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth-guard';
import { LocalAuthGuard } from './guard/local-auth-guard';
import { Throttle } from '@nestjs/throttler';
import { UserDto } from './dto/user.dto';
import { Response, Request as ExpressRequest } from 'express';
import { ref } from 'process';

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
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user);

    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
      sameSite: 'lax', // or 'strict'
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie('jwt_refresh', token.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
      sameSite: 'lax', // or 'strict'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['jwt_refresh'];
    try {
      const newToken = await this.authService.refresh(refreshToken);

      res.cookie('jwt', newToken.new_access_token, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      });

      return { message: 'Access token refreshed' };
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @UseGuards(JwtAuthGuard) // opsional jika ingin hanya bisa logout saat sudah login
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
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
