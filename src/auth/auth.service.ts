import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { users as UserModel } from '@prisma/client';
import { RegisterPosyanduDto } from './dto/register-posyandu.dto';
import { RegisterPsikologDto } from './dto/register-psikolog.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { UserDto } from './dto/user.dto';
import { ref } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: MailService, // Assuming you have a MailService for sending emails
  ) {}

  async registerPosyandu(
    dataPosyandu: RegisterPosyanduDto,
    dataUser: UserDto,
  ): Promise<UserModel> {
    const existingUser = await this.usersService.user({
      email: dataUser.email,
    });
    const saltOrRounds = 10;
    const password = dataUser.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    if (existingUser) {
      throw new InternalServerErrorException('Email sudah terdaftar');
    }
    return this.usersService.createUser({
      name: dataUser.name,
      email: dataUser.email,
      password: hash,
      no_telp: dataUser.no_telp,
      role: 'posyandu',
      verification: 'unverified',
      created_at: new Date(),
      users_posyandu: {
        create: {
          lokasi: dataPosyandu.lokasi,
          nama_posyandu: dataPosyandu.nama_posyandu,
        },
      },
    });
  }

  async registerPsikolog(
    dataPsikolog: RegisterPsikologDto,
    dataUser: UserDto,
  ): Promise<UserModel> {
    const existingUser = await this.usersService.user({
      email: dataUser.email,
    });
    const saltOrRounds = 10;
    const password = dataUser.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    if (existingUser) {
      throw new InternalServerErrorException('Email sudah terdaftar');
    }
    return this.usersService.createUser({
      name: dataUser.name,
      email: dataUser.email,
      password: hash,
      no_telp: dataUser.no_telp,
      role: 'psikolog',
      verification: 'unverified',
      created_at: new Date(),
      users_psikolog: {
        create: {
          lokasi: dataPsikolog.lokasi,
          spesialis: dataPsikolog.spesialis,
        },
      },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.user({
      email,
    });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.emailService.sendResetPasswordLink(email);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const email = await this.emailService.decodeConfirmationToken(token);

    const user = await this.usersService.user({
      email,
    });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    console.log('Resetting password for user:', user.password);
    user.password = hash;
    await this.usersService.updateUser({
      where: { email: user.email },
      data: { password: hash },
    });
    // remove the token after the password is updated
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.user({ email });

    const isMatch = await bcrypt.compare(password, user?.password || '');

    if (user && isMatch) {
      // Bandingkan hash jika kamu pakai bcrypt
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }

  async refresh(refreshToken: string): Promise<{ new_access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newToken = this.jwtService.sign(
        {
          email: payload.email,
          sub: payload.sub,
          role: payload.role,
        },
        { expiresIn: '30m' },
      );

      return { new_access_token: newToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
