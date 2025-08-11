import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LowonganService } from './lowongan.service';
import { Roles } from 'src/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { LowonganDto } from 'src/dto/lowongan';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';
import deleteFile from 'src/lib/file-cleanup.intercaptor';

@Controller('/admin/lowongan')
export class LowonganController {
  constructor(private readonly lowonganService: LowonganService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async createLowongan(
    @Body() data: LowonganDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const userId = req.user.id;
    const now = new Date();
    const fileExtension = file?.originalname.split('.').pop();
    const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file?.originalname).digest('hex')}.${fileExtension}`;

    return this.lowonganService.create(data, userId, fileName);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async getAllLowongan(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query() query: Record<string, any>,
  ): Promise<any> {
    const pageNumber = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit) || 10;
    const { page: _p, limit: _l, orderBy: _o, sort: _s, ...filter } = query;
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
    return this.lowonganService.findAll({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      page: parseInt(page) || 1,
      orderBy: { created_at: 'desc' },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('detail/:id')
  @Roles('admin')
  async getLowongan(@Param('id') id: string): Promise<any> {
    return this.lowonganService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async updateLowongan(
    @Body() data: LowonganDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    const userId = req.user.id;
    let fileName: string | undefined;
    if (file) {
      // Delete old file if exists
      try {
        const oldLowongan = await this.lowonganService.findOne({ id: data.id });
        if (oldLowongan?.file_name) {
          const oldFilePath = `uploads/${oldLowongan.file_name}`;
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
      const fileExtension = file?.originalname.split('.').pop();
      fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file?.originalname).digest('hex')}.${fileExtension}`;
    }
    return this.lowonganService.update({ id: data.id }, data, userId, fileName);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  @Roles('admin')
  @UseInterceptors()
  async deleteLowongan(@Body() data: LowonganDto): Promise<any> {
    try {
      const lowongan = await this.lowonganService.findOne({ id: data.id });
      if (!lowongan?.file_name) {
        console.error('File not found for deletion.');
      } else {
        const filePath = `uploads/${lowongan.file_name}`;
        try {
          await deleteFile(filePath);
        } catch (error) {
          return {
            message: `Failed to delete file: ${error.message}`,
          };
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
    await this.lowonganService.delete({ id: data.id });
    return {
      message: 'Lowongan deleted successfully',
    };
  }
}
