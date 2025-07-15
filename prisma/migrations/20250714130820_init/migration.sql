/*
  Warnings:

  - You are about to drop the `detail_pasien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pasien` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_posyandu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_pasien" DROP CONSTRAINT "detail_pasien_pasien_id_fkey";

-- DropForeignKey
ALTER TABLE "pasien" DROP CONSTRAINT "pasien_user_posyandu_fkey";

-- DropForeignKey
ALTER TABLE "users_posyandu" DROP CONSTRAINT "users_posyandu_user_id_fkey";

-- DropTable
DROP TABLE "detail_pasien";

-- DropTable
DROP TABLE "pasien";

-- DropTable
DROP TABLE "users_posyandu";

-- CreateTable
CREATE TABLE "users_kader" (
    "id" UUID NOT NULL,
    "jabatan" VARCHAR,
    "user_id" UUID NOT NULL,

    CONSTRAINT "users_kader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kader_posyandu" (
    "id" UUID NOT NULL,
    "user_kader_id" UUID NOT NULL,
    "posyandu_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "kader_posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posyandu" (
    "id" UUID NOT NULL,
    "nama_posyandu" VARCHAR NOT NULL,
    "alamat" VARCHAR,
    "no_telp" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "users_id" UUID,

    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_posyandu" (
    "id" UUID NOT NULL,
    "posyandu_id" UUID NOT NULL,
    "nama_kegiatan" VARCHAR,
    "jenis_kegiatan" VARCHAR,
    "deskripsi" TEXT,
    "file_name" VARCHAR,
    "lokasi" VARCHAR,
    "tanggal" TIMESTAMP(6),
    "waktu_mulai" VARCHAR,
    "waktu_selesai" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "jadwal_posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presensi_kader" (
    "id" UUID NOT NULL,
    "user_kader_id" UUID NOT NULL,
    "posyandu_id" UUID NOT NULL,
    "jadwal_id" UUID NOT NULL,
    "hadir" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "presensi_kader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presensi_ibk" (
    "id" UUID NOT NULL,
    "user_ibk_id" UUID NOT NULL,
    "posyandu_id" UUID NOT NULL,
    "jadwal_id" UUID NOT NULL,
    "hadir" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "presensi_ibk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ibk" (
    "id" UUID NOT NULL,
    "nama" VARCHAR,
    "nik" BIGINT NOT NULL,
    "tanggal_lahir" TIMESTAMP(6),
    "jenis_kelamin" VARCHAR,
    "umur" INTEGER,
    "jenis_difasilitas" VARCHAR NOT NULL,
    "alamat" VARCHAR,
    "no_telp" VARCHAR,
    "nama_wali" VARCHAR,
    "no_telp_wali" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "users_kaderId" UUID,

    CONSTRAINT "ibk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_ibk" (
    "id" UUID NOT NULL,
    "ibk_id" UUID NOT NULL,
    "odgj" BOOLEAN NOT NULL,
    "file_foto" VARCHAR,
    "pekerjaan" VARCHAR,
    "pendidikan" VARCHAR,
    "status_perkawinan" VARCHAR,
    "hasil_diagnosa" TEXT,
    "jenis_bantuan" VARCHAR,
    "titik_koordinat" VARCHAR,
    "keterangan_tambahan" TEXT,
    "potensi" TEXT,
    "minat" TEXT,
    "status" VARCHAR,
    "bakat" TEXT,
    "keterampilan" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "detail_ibk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disabilitas_ibk" (
    "id" UUID NOT NULL,
    "ibk_id" UUID NOT NULL,
    "jenis_difabilitas_id" UUID NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "disabilitas_ibk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_difasilitas" (
    "id" UUID NOT NULL,
    "nama" VARCHAR NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "jenis_difasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_ibk" (
    "id" UUID NOT NULL,
    "ibk_id" UUID NOT NULL,
    "jadwal_posyandu_id" UUID,
    "keluhan" TEXT,
    "perilaku_baru" TEXT,
    "tindak_lanjut" TEXT,
    "fungsional_checklist" TEXT,
    "tanggal_kunjungan" TIMESTAMP(6),
    "kecamatan" VARCHAR,
    "users_kader_id" UUID,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "monitoring_ibk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_kader" ADD CONSTRAINT "users_kader_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kader_posyandu" ADD CONSTRAINT "kader_posyandu_user_kader_id_fkey" FOREIGN KEY ("user_kader_id") REFERENCES "users_kader"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kader_posyandu" ADD CONSTRAINT "kader_posyandu_posyandu_id_fkey" FOREIGN KEY ("posyandu_id") REFERENCES "posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posyandu" ADD CONSTRAINT "posyandu_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jadwal_posyandu" ADD CONSTRAINT "jadwal_posyandu_posyandu_id_fkey" FOREIGN KEY ("posyandu_id") REFERENCES "posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presensi_kader" ADD CONSTRAINT "presensi_kader_user_kader_id_fkey" FOREIGN KEY ("user_kader_id") REFERENCES "users_kader"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presensi_kader" ADD CONSTRAINT "presensi_kader_posyandu_id_fkey" FOREIGN KEY ("posyandu_id") REFERENCES "posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presensi_kader" ADD CONSTRAINT "presensi_kader_jadwal_id_fkey" FOREIGN KEY ("jadwal_id") REFERENCES "jadwal_posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presensi_ibk" ADD CONSTRAINT "presensi_ibk_posyandu_id_fkey" FOREIGN KEY ("posyandu_id") REFERENCES "posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presensi_ibk" ADD CONSTRAINT "presensi_ibk_jadwal_id_fkey" FOREIGN KEY ("jadwal_id") REFERENCES "jadwal_posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "presensi_ibk" ADD CONSTRAINT "presensi_ibk_user_ibk_id_fkey" FOREIGN KEY ("user_ibk_id") REFERENCES "ibk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ibk" ADD CONSTRAINT "ibk_users_kaderId_fkey" FOREIGN KEY ("users_kaderId") REFERENCES "users_kader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_ibk" ADD CONSTRAINT "detail_ibk_ibk_id_fkey" FOREIGN KEY ("ibk_id") REFERENCES "ibk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disabilitas_ibk" ADD CONSTRAINT "disabilitas_ibk_ibk_id_fkey" FOREIGN KEY ("ibk_id") REFERENCES "ibk"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "disabilitas_ibk" ADD CONSTRAINT "disabilitas_ibk_jenis_difabilitas_id_fkey" FOREIGN KEY ("jenis_difabilitas_id") REFERENCES "jenis_difasilitas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "monitoring_ibk" ADD CONSTRAINT "monitoring_ibk_ibk_id_fkey" FOREIGN KEY ("ibk_id") REFERENCES "ibk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "monitoring_ibk" ADD CONSTRAINT "monitoring_ibk_jadwal_posyandu_id_fkey" FOREIGN KEY ("jadwal_posyandu_id") REFERENCES "jadwal_posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "monitoring_ibk" ADD CONSTRAINT "monitoring_ibk_users_kader_id_fkey" FOREIGN KEY ("users_kader_id") REFERENCES "users_kader"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
