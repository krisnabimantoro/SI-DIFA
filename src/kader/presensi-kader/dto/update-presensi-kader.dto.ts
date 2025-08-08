import { PartialType } from '@nestjs/mapped-types';
import { CreatePresensiKaderDto } from './create-presensi-kader.dto';

export class UpdatePresensiKaderDto extends PartialType(CreatePresensiKaderDto) {}
