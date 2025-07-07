import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPosyanduDto } from './dto/register-posyandu.dto';
import { RegisterPsikologDto } from './dto/register-psikolog.dto';

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
}
