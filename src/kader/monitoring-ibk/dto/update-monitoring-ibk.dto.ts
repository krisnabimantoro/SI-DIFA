import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoringIbkDto } from './create-monitoring-ibk.dto';

export class UpdateMonitoringIbkDto extends PartialType(CreateMonitoringIbkDto) {}
