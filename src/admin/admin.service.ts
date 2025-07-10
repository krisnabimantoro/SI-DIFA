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

  async verificationUser(
    userId: string,
    newVerification: string,
  ): Promise<any> {
    const user = await this.usersService.user({ id: userId });
    try {
      const changeVerificationUser = await this.usersService.updateUser({
        where: { id: userId },
        data: { verification: newVerification },
      });

      if (!changeVerificationUser) {
        throw new NotFoundException(
          'User tidak ditemukan atau gagal diperbarui',
        );
      }
      if (user && user.verification === 'verified') {
        throw new BadRequestException('User sudah terverifikasi');
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
