import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InformasiEdukasiService } from './informasi-edukasi.service';
import { InformasiEdukasiController } from './informasi-edukasi.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { encryptToken } from 'src/lib/encrypt';
import * as crypto from 'crypto';

@Module({
  providers: [PrismaService, InformasiEdukasiService],
  controllers: [InformasiEdukasiController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const now = new Date();
          const fileExtension = file?.originalname.split('.').pop();
          const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file?.originalname).digest('hex')}.${fileExtension}`;

          cb(null, fileName);
        },
      }),
    }),
  ],
  exports: [InformasiEdukasiService],
})
export class InformasiEdukasiModule {}
