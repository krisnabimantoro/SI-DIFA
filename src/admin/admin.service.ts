import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async listUser(
    page: number = 1,
    limit: number = 10,
    filter: { [key: string]: any } = {},
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const users = await this.usersService.users({
      where: filter,
      skip,
      take: limit,
    });

    const totalUsers = await this.usersService.users({ where: filter });
    const totalPages = Math.ceil(totalUsers.length / limit);

    return {
      data: users,
      meta: {
        totalUsers: totalUsers.length,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async verificationUser(
    userId: string,
    newVerification: string,
  ): Promise<any> {
    try {
      const user = await this.usersService.user({ id: userId });

      if (
        user?.verification === 'verified' &&
        user?.verification === newVerification
      ) {
        throw new BadRequestException('User sudah terverifikasi');
      }
      const changeVerificationUser = await this.usersService.updateUser({
        where: { id: userId },
        data: { verification: newVerification },
      });

      if (!changeVerificationUser) {
        throw new NotFoundException(
          'User tidak ditemukan atau gagal diperbarui',
        );
      }
      return {
        message: 'User berhasil diverifikasi',
        user: changeVerificationUser,
      };
    } catch (error) {
      throw new BadRequestException(
        `Gagal melakukan verifikasi user: ${error.message}`,
      );
    }
  }
}
