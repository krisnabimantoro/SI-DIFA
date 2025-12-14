export class CreateJadwalPosyanduDto {
  readonly id?: string;
  readonly posyandu_id: string;
  readonly nama_kegiatan: string;
  readonly jenis_kegiatan: string;
  readonly deskripsi: string;
  readonly file_name?: string;
  readonly lokasi: string;
  readonly tanggal: Date;
  readonly waktu_mulai: string;
  readonly waktu_selesai: string;
  readonly created_at: Date;
  readonly updated_at?: Date;
  readonly deleted_at?: Date;
}
