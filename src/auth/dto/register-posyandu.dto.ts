import { IsEmail } from "class-validator";

export class RegisterPosyanduDto {
  name: string;

  @IsEmail()
  email: string;

  password: string;
  lokasi?: string;
  no_telp?: string;
  nama_posyandu?: string;
}
