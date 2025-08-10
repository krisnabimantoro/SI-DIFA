import { PartialType } from '@nestjs/mapped-types';
import { CreatePresensiKaderDto } from './create-presensi-kader.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePresensiKaderDto extends PartialType(
  CreatePresensiKaderDto,
) {
  @IsString()
  @IsOptional()
  status_presensi?: string;
}
