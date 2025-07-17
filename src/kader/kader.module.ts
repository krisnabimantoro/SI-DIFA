import { Module } from '@nestjs/common';
import { KaderService } from './kader.service';
import { KaderController } from './kader.controller';
import { PosyanduKaderModule } from './posyandu-kader/posyandu-kader.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  controllers: [KaderController],
  providers: [KaderService],
  imports: [PosyanduKaderModule, AdminModule],
})
export class KaderModule {}
