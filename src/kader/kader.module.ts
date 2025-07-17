import { Module } from '@nestjs/common';
import { KaderService } from './kader.service';
import { KaderController } from './kader.controller';
import { PosyanduModule } from './posyandu/posyandu.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  controllers: [KaderController],
  providers: [KaderService],
  imports: [PosyanduModule, AdminModule],
})
export class KaderModule {}
