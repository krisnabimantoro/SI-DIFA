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
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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
    if (existingUser) {
      throw new InternalServerErrorException('Email sudah terdaftar');
    }
    return this.usersService.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
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

    if (existingUser) {
      throw new InternalServerErrorException('Email sudah terdaftar');
    }
    return this.usersService.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
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
}
