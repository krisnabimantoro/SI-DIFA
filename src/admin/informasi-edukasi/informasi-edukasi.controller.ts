import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
    // @UploadedFile(
    //   new ParseFilePipeBuilder()
    //     .addFileTypeValidator({
    //       fileType: 'png|jpg|jpeg|pdf',
    //     })
    //     .build({
    //       fileIsRequired: true,
    //     }),
    // )
    // file?: Express.Multer.File,

    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const userId = req.user.id;
    const fileName = `${Date.now()}-${file?.originalname}`;

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
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('detail')
  @Roles('admin')
  async getInformasiEdulasi(@Body() data: InformasiEdukasiDto): Promise<any> {
    return this.informasiEdukasiService.getInformasiEdukasi({ id: data.id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  @Roles('admin')
  async updateInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.id;
    return this.informasiEdukasiService.updateInformasiEdukasi(
      { id: data.id },
      {
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file_name: data.file_name,
        updated_at: new Date(),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  @Roles('admin')
  async deleteInformasiEdukasi(
    @Body() data: InformasiEdukasiDto,
  ): Promise<any> {
    await this.informasiEdukasiService.deleteInformasiEdukasi({
      id: data.id,
    });

    return {
      message: 'Informasi edukasi deleted successfully',
    };
  }
}
