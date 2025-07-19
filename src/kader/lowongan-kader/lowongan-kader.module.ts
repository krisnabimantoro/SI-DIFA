import { Module } from '@nestjs/common';
import { LowonganKaderController } from './lowongan-kader.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [LowonganKaderController],
})
export class LowonganKaderModule {}
