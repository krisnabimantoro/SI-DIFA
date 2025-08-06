import { jadwal_posyandu, users_kader } from '@prisma/client';
export class CreateMonitoringIbkDto {
  readonly id?: string;
  readonly ibk_id: string;
  readonly users_kader_id: string;
  readonly jadwal_posyandu_id: string;
  readonly keluhan?: string;
  readonly perilaku_baru?: string;
  readonly tindak_lanjut?: string;
  readonly fungsional_checklist?: string;
  readonly tanggal_kunjungan?: Date;
  readonly kecamatan?: string;
  readonly keterangan?: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;
  readonly deleted_at?: Date;
}
