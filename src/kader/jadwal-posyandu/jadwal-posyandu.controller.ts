import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';
import deleteFile from 'src/lib/file-cleanup.intercaptor';

@Controller('/kader/jadwal-posyandu')
export class JadwalPosyanduController {
  constructor(private readonly jadwalPosyanduService: JadwalPosyanduService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('kader', 'admin')
  @UseInterceptors(FileInterceptor('file_name'))
  async createJadwalPosyandu(
    @Body() data: CreateJadwalPosyanduDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    let fileName: string | undefined;
    if (file) {
      const now = new Date();
      const fileExtension = file.originalname.split('.').pop();
      fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file.originalname).digest('hex')}.${fileExtension}`;
    }

    const jadwalData = {
      ...data,
      ...(fileName && { file_name: fileName }),
    };

    return this.jadwalPosyanduService.create(data.posyandu_id, jadwalData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/:posyanduId")
  @Roles('kader', 'admin')
  async getAllJadwalPosyandu(
    @Query() query: Record<string, any>,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Param('posyanduId') posyanduId?: string,
  ): Promise<any> {
    const pageNumber = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit) || 10;
    const {
      page: _p,
      limit: _l,
      orderBy: _o,
      sort: _s,
      posyanduId: _pos,
      ...filter
    } = query;

    const modifiedFilter = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = { contains: value, mode: 'insensitive' };
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    return this.jadwalPosyanduService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      posyanduId,
      orderBy: { created_at: 'desc' },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/detail/:id')
  @Roles('kader', 'admin')
  async getJadwalPosyandu(@Param('id') id: string): Promise<any> {
    return this.jadwalPosyanduService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  @Roles('kader', 'admin')
  @UseInterceptors(FileInterceptor('file_name'))
  async updateJadwalPosyandu(
    @Param('id') id: string,
    @Body() data: UpdateJadwalPosyanduDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    let fileName: string | undefined;
    if (file) {
      // Delete old file if exists
      try {
        const oldJadwal = await this.jadwalPosyanduService.findOne({ id });
        if (oldJadwal?.file_name) {
          const oldFilePath = `uploads/${oldJadwal.file_name}`;
          try {
            await deleteFile(oldFilePath);
          } catch (error) {
            console.error('Failed to delete old file:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching old file for deletion:', error);
      }

      // Generate new file name
      const now = new Date();
      const fileExtension = file.originalname.split('.').pop();
      fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file.originalname).digest('hex')}.${fileExtension}`;
    }

    return this.jadwalPosyanduService.update({ id }, data, fileName);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @Roles('kader', 'admin')
  async deleteJadwalPosyandu(@Param('id') id: string): Promise<any> {
    try {
      const jadwal = await this.jadwalPosyanduService.findOne({ id });
      if (jadwal?.file_name) {
        const filePath = `uploads/${jadwal.file_name}`;
        try {
          await deleteFile(filePath);
        } catch (error) {
          console.error('Failed to delete file:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.jadwalPosyanduService.remove({ id });
    return {
      message: 'Jadwal posyandu deleted successfully',
    };
  }
}
