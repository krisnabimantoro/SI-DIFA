import { Module } from '@nestjs/common';
import { DisabilitasIbkService } from './disabilitas-ibk.service';
import { DisabilitasIbkController } from './disabilitas-ibk.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DisabilitasIbkController],
  providers: [DisabilitasIbkService, PrismaService],
})
export class DisabilitasIbkModule {}
