import { PartialType } from '@nestjs/mapped-types';
import { CreateJadwalPosyanduDto } from './create-jadwal-posyandu.dto';

export class UpdateJadwalPosyanduDto extends PartialType(CreateJadwalPosyanduDto) {}
