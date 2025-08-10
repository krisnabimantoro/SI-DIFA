import { PartialType } from '@nestjs/mapped-types';
import { CreateDisabilitasIbkDto } from './create-disabilitas-ibk.dto';

export class UpdateDisabilitasIbkDto extends PartialType(
  CreateDisabilitasIbkDto,
) {}
