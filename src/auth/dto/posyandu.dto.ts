import { IsEmail, Matches, MinLength } from 'class-validator';

export class PosyanduDto {
  lokasi?: string;
  nama_posyandu?: string;
}
