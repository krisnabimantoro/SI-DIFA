import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(where: Prisma.usersWhereUniqueInput) {
    const dataUser = await this.prismaService.users.findUnique({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        no_telp: true,
        created_at: true,
        users_kader: {
          select: {
            id: true,
            jabatan: true,
          },
        },
      },
    });

    const dataPosyanduKader = await this.prismaService.kader_posyandu.findMany({
      where: {
        user_kader_id: dataUser?.users_kader?.[0]?.id,
      },
      select: {
        posyandu_id: true,
        posyandu: {
          select: {
            nama_posyandu: true,
            alamat: true,
          },
        },
      },
    });

    return {
      ...dataUser,
      kader_posyandu: dataPosyanduKader,
    };
  }

  async update(
    where: Prisma.usersWhereUniqueInput,
    updateProfileDto: UpdateProfileDto,
  ) {
    const { id_users_kader, jabatan, ...userFields } = updateProfileDto;

    // Update users table
    const updatedUser = await this.prismaService.users.update({
      where,
      data: {
        ...userFields,
        updated_at: new Date(),
      },
    });

    // Update users_kader table if jabatan is provided
    if (jabatan) {
      // Find users_kader record using user_id from updatedUser
      await this.prismaService.users_kader.updateMany({
        where: { user_id: updatedUser.id },
        data: {
          jabatan,
          updated_at: new Date(),
        },
      });
    }

    return { message: 'Profile updated successfully' };
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
