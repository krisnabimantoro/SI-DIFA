import { Module } from '@nestjs/common';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { JadwalPosyanduController } from './jadwal-posyandu.controller';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';

@Module({
  controllers: [JadwalPosyanduController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/jadwal-posyandu',
        filename: (req, file, cb) => {
          const now = new Date();
          const fileExtension = file?.originalname.split('.').pop();
          console.log('fileExtension', fileExtension);
          const fileName = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}-${crypto.createHash('sha256').update(file?.originalname).digest('hex')}.${fileExtension}`;

          cb(null, fileName);
        },
      }),
    }),
  ],
  providers: [JadwalPosyanduService, PrismaService],
})
export class JadwalPosyanduModule {}
