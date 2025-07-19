export class LowonganDto {
  readonly id?: string;
  readonly nama_lowongan: string;
  readonly nama_perusahaan: string;
  readonly jenis_pekerjaan: string;
  readonly lokasi: string;
  readonly jenis_difasilitas?: string;
  readonly deskripsi?: string;
  readonly file_name?: string;
  readonly status?: string;
  readonly tanggal_mulai?: Date;
  readonly tanggal_selesai?: Date;
  readonly created_at?: Date;
  readonly updated_at?: Date;
  readonly deleted_at?: Date;
  readonly user_id: string;
}
