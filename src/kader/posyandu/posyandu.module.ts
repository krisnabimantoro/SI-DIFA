import { Module } from '@nestjs/common';
import { PosyanduController } from './posyandu.controller';
import { PosyanduService } from 'src/admin/posyandu/posyandu.service';
import { PrismaService } from 'src/prisma.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [PosyanduController],
  providers: []
})
export class PosyanduModule {}
