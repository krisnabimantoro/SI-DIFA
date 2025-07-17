import { Module } from '@nestjs/common';
import { PosyanduKaderController } from './posyandu-kader.controller';
import { PosyanduService } from 'src/admin/posyandu/posyandu.service';
import { PrismaService } from 'src/prisma.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [PosyanduKaderController],
  providers: [],
})
export class PosyanduKaderModule {}
