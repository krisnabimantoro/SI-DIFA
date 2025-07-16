import { PartialType } from '@nestjs/mapped-types';
import { CreatePosyanduDto } from './create-posyandu.dto';

export class UpdatePosyanduDto extends PartialType(CreatePosyanduDto) {}
