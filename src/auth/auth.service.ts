import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { users as UserModel } from '@prisma/client';
import { RegisterPosyanduDto } from './dto/register-posyandu.dto';
import { RegisterPsikologDto } from './dto/register-psikolog.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerPosyandu(data: RegisterPosyanduDto): Promise<UserModel> {
    const existingUser = await this.usersService.user({
      email: data.email,
    });
    const saltOrRounds = 10;
    const password = data.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    if (existingUser) {
      throw new InternalServerErrorException('Email sudah terdaftar');
    }
    return this.usersService.createUser({
      name: data.name,
      email: data.email,
      password: hash,
      no_telp: data.no_telp,
      role: 'posyandu',
      verification: 'unverified',
      created_at: new Date(),
      users_posyandu: {
        create: {
          lokasi: data.lokasi,
          nama_posyandu: data.nama_posyandu,
        },
      },
    });
  }

  async registerPsikolog(data: RegisterPsikologDto): Promise<UserModel> {
    const existingUser = await this.usersService.user({
      email: data.email,
    });
    const saltOrRounds = 10;
    const password = data.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    if (existingUser) {
      throw new InternalServerErrorException('Email sudah terdaftar');
    }
    return this.usersService.createUser({
      name: data.name,
      email: data.email,
      password: hash,
      no_telp: data.no_telp,
      role: 'psikolog',
      verification: 'unverified',
      created_at: new Date(),
      users_psikolog: {
        create: {
          lokasi: data.lokasi,
          spesialis: data.spesialis,
        },
      },
    });
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
    };
  }
}
