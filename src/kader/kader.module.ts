import { Module } from '@nestjs/common';
import { KaderService } from './kader.service';
import { KaderController } from './kader.controller';

@Module({
  controllers: [KaderController],
  providers: [KaderService],
})
export class KaderModule {}
