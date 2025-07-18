import { PartialType } from '@nestjs/mapped-types';
import { CreatePendataanIbkDto } from './create-pendataan-ibk.dto';

export class UpdatePendataanIbkDto extends PartialType(CreatePendataanIbkDto) {}
