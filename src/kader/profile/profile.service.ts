import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, users, users_kader } from '@prisma/client';

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

  update(
    where: Prisma.usersWhereUniqueInput,
    updateProfileDto: UpdateProfileDto,
  ) {
    const { id_users_kader } = updateProfileDto;
    return this.prismaService.users.update({
      where,
      data: {
        ...updateProfileDto,
        ...(id_users_kader && {
          users_kader: { connect: { id: id_users_kader } },
        }),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
