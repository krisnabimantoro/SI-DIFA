import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InformasiEdukasiService } from './informasi-edukasi.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { InformasiEdukasiDto } from 'src/dto/informasi-edukasi';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  NoFilesInterceptor,
} from '@nestjs/platform-express';
import deleteFile from 'src/lib/file-cleanup.intercaptor';
import fastifyCsrf from '@fastify/csrf-protection';
import { encryptToken } from 'src/lib/encrypt';
import * as crypto from 'crypto';

@Controller('/admin/informasi-edukasi')
export class InformasiEdukasiController {
  constructor(
    private readonly informasiEdukasiService: InformasiEdukasiService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async createInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
    @Req() req: any,

    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const userId = req.user.id;
    const now = new Date();
    const fileExtension = file?.originalname.split('.').pop();
    const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file?.originalname).digest('hex')}.${fileExtension}`;

    return this.informasiEdukasiService.createInformasiEdukasi(
      data,
      userId,
      fileName,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('admin')
  async getAllInformasiEdukasi(
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

    return this.informasiEdukasiService.getAllInformasiEdukasi({
      skip: pageNumber,
      take: limitNumber,
      where: modifiedFilter,
      orderBy: { created_at: 'desc' },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('detail/:id')
  @Roles('admin')
  async getInformasiEdulasi(@Param('id') id: string): Promise<any> {
    return this.informasiEdukasiService.getInformasiEdukasi({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('statistik')
  @Roles('admin')
  async getCountTipeInformasiEdukasi(): Promise<any> {
    const count =
      await this.informasiEdukasiService.getCountTipeInformasiEdukasi();
    return { count };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async updateInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    const userId = req.user.id;

    let fileName: string | undefined;

    if (file) {
      // Delete old file if exists
      try {
        const oldFile = await this.informasiEdukasiService.getFilePathInformasi(
          { id: data.id },
        );
        if (oldFile) {
          const oldFilePath = `uploads/${oldFile}`;
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

    return this.informasiEdukasiService.updateInformasiEdukasi(
      { id: data.id },
      data,
      userId,
      fileName,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  @Roles('admin')
  @UseInterceptors()
  async deleteInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
  ): Promise<any> {
    try {
      const file = await this.informasiEdukasiService.getFilePathInformasi({
        id: data.id,
      });
      if (!file) {
        console.error('File not found for deletion.');
        return { message: 'File not found' };
      } else if (file === null || file === undefined || file === '') {
        console.error('File path is null, cannot delete file.');
        return { message: 'File path is null, cannot delete file.' };
      } else {
        const filePath = `uploads/${file}`;
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

    await this.informasiEdukasiService.deleteInformasiEdukasi({
      id: data.id,
    });

    return {
      message: 'Informasi edukasi deleted successfully',
    };
  }
}
