import { PartialType } from '@nestjs/mapped-types';
import { CreateKaderDto } from './create-kader.dto';

export class UpdateKaderDto extends PartialType(CreateKaderDto) {}
