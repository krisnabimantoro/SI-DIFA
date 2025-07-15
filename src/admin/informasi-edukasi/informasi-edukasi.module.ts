import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InformasiEdukasiService } from './informasi-edukasi.service';
import { InformasiEdukasiController } from './informasi-edukasi.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';

@Module({
  providers: [PrismaService, InformasiEdukasiService],
  controllers: [InformasiEdukasiController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const now = new Date();
          const filename = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${file?.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
})
export class InformasiEdukasiModule {}
