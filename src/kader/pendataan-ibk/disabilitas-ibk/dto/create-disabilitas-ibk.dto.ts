import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDisabilitasIbkDto {
  @IsString()
  @IsNotEmpty()
  ibk_id: string;

  @IsString()
  @IsNotEmpty()
  jenis_difabilitas_id: string;

  @IsString()
  @IsOptional()
  tingkat_keparahan?: string;

  @IsDateString()
  @IsOptional()
  sejak_kapan?: Date;

  @IsString()
  @IsOptional()
  keterangan?: string;
}

// For bulk creation, we accept an array directly
export type BulkCreateDisabilitasIbkDto = CreateDisabilitasIbkDto[];
