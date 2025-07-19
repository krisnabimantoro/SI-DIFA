import { Module } from '@nestjs/common';
import { LowonganService } from './lowongan.service';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import { LowonganController } from './lowongan.controller';

@Module({
  providers: [LowonganService, PrismaService],
  controllers: [LowonganController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/lowongan',
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
  exports: [LowonganService],
})
export class LowonganModule {}
