import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

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
