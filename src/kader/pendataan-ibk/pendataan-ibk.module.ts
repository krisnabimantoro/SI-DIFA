import { Module } from '@nestjs/common';
import { PendataanIbkService } from './pendataan-ibk.service';
import { PendataanIbkController } from './pendataan-ibk.controller';

@Module({
  controllers: [PendataanIbkController],
  providers: [PendataanIbkService],
})
export class PendataanIbkModule {}
