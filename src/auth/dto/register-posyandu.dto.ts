import { IsEmail, Matches, MinLength } from 'class-validator';

export class RegisterPosyanduDto {
  lokasi?: string;
  nama_posyandu?: string;
}
