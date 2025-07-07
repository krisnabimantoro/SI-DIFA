import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { users as UserModel } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //   async signIn(
  //     username: string,
  //     pass: string,
  //   ): Promise<{ access_token: string }> {
  //     const user = await this.usersService.findOne(username);
  //     if (user?.password !== pass) {
  //       throw new UnauthorizedException();
  //     }
  //     const payload = { sub: user.userId, username: user.username };
  //     return {
  //       access_token: await this.jwtService.signAsync(payload),
  //     };
  //   }

  async registerPosyandu(
    name: string,
    email: string,
    password: string,
    lokasi?: string,
    no_telp?: string,
    nama_posyandu?: string,
  ): Promise<UserModel> {
    return this.usersService.createUser({
      name,
      email,
      password,
      no_telp,
      role: 'posyandu',
      verification: 'unverified',
      created_at: new Date(),
      users_posyandu: {
        create: {
          lokasi,
          nama_posyandu,
        },
      },
    });
  }
}
