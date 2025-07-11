import { Module } from '@nestjs/common';
import { LowonganService } from './lowongan.service';

@Module({
  providers: [LowonganService]
})
export class LowonganModule {}
