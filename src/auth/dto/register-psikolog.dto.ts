import { IsEmail } from 'class-validator';

export class RegisterPsikologDto {
  name: string;

  @IsEmail()
  email: string;

  password: string;
  lokasi?: string;
  no_telp?: string;
  spesialis?: string;
}
