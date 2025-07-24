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

import { RegisterPsikologDto } from '../dto/register-psikolog.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { LocalAuthGuard } from '../guards/local-auth-guard';
import { Throttle } from '@nestjs/throttler';
import { UserDto } from '../dto/user.dto';
import { Response, Request as ExpressRequest } from 'express';
import { ref } from 'process';
import { decryptToken } from 'src/lib/decrypt';
import { encryptToken } from 'src/lib/encrypt';
import { KaderDto } from '../dto/kader.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup/kader')
  async signUp(@Body() userDto: UserDto, @Body() signUpKaderDto: KaderDto) {
    return this.authService.registerKader(signUpKaderDto, userDto);
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
      sameSite: 'none' as const, // allow cross-site cookie for dev
      secure: true, // or 'strict'
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie('jwt_refresh', token.refresh_token, {
      httpOnly: true,
      sameSite: 'none' as const, // allow cross-site cookie for dev
      secure: true, // or 'strict'
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
    // const decryptedRefreshToken = decryptToken(refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('No valid refresh token provided');
    }
    try {
      const newToken = await this.authService.refresh(refreshToken);
      const encryptAccessToken = newToken.new_access_token;

      res.cookie('jwt', encryptAccessToken, {
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
      sameSite: 'none' as const, // allow cross-site cookie for dev
      secure: true,
    });
    res.clearCookie('jwt_refresh', {
      httpOnly: true,
      sameSite: 'none' as const, // allow cross-site cookie for dev
    secure: true,
    });

    return { message: 'Logout successful' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('me')
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
