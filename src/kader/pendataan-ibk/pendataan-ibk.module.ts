import { Module } from '@nestjs/common';
import { PendataanIbkService } from './pendataan-ibk.service';
import { PendataanIbkController } from './pendataan-ibk.controller';
import { PrismaService } from 'src/prisma.service';
import { DisabilitasIbkModule } from './disabilitas-ibk/disabilitas-ibk.module';

@Module({
  controllers: [PendataanIbkController],
  providers: [PendataanIbkService,PrismaService],
  imports: [DisabilitasIbkModule],
})
export class PendataanIbkModule {}
