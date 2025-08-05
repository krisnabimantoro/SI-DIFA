import { PartialType } from '@nestjs/mapped-types';
import { CreatePresensiIbkDto } from './create-presensi-ibk.dto';

export class UpdatePresensiIbkDto extends PartialType(CreatePresensiIbkDto) {}
