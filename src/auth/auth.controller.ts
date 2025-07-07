import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup/posyandu')
  signUp(@Body() signUpPosyanduDto: Record<string, any>) {
    return this.authService.registerPosyandu(
      signUpPosyanduDto.name,
      signUpPosyanduDto.email,
      signUpPosyanduDto.password,
      signUpPosyanduDto.lokasi,
      signUpPosyanduDto.no_telp,
      signUpPosyanduDto.nama_posyandu,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup/psikolog')
  signUpPsikolog(@Body() signUpPsikologDto: Record<string, any>) {
    return this.authService.registerPsikolog(
      signUpPsikologDto.name,
      signUpPsikologDto.email,
      signUpPsikologDto.password,
      signUpPsikologDto.lokasi,
      signUpPsikologDto.no_telp,
      signUpPsikologDto.spesialis,
    );
  }

}
