import { IsEmail, Matches, MinLength } from 'class-validator';

export class UserDto {
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password: string;
  no_telp?: string;
}
