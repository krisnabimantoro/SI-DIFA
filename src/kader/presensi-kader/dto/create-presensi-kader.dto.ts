import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePresensiKaderDto {
  @IsString()
  @IsNotEmpty()
  user_kader_id: string;

  @IsString()
  @IsNotEmpty()
  jadwal_id: string;

  @IsString()
  @IsOptional()
  status_presensi?: string;
}
