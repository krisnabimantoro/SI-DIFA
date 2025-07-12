/*
  Warnings:

  - You are about to drop the `informasi` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `nama_lowongan` on table `lowongan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jenis_pekerjaan` on table `lowongan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nama_perusahaan` on table `lowongan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lokasi` on table `lowongan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "informasi" DROP CONSTRAINT "informasi_user_id_fkey";

-- AlterTable
ALTER TABLE "lowongan" ADD COLUMN     "file_name" VARCHAR,
ADD COLUMN     "status" VARCHAR,
ADD COLUMN     "tanggal_mulai" TIMESTAMP(6),
ADD COLUMN     "tanggal_selesai" TIMESTAMP(6),
ALTER COLUMN "nama_lowongan" SET NOT NULL,
ALTER COLUMN "jenis_pekerjaan" SET NOT NULL,
ALTER COLUMN "nama_perusahaan" SET NOT NULL,
ALTER COLUMN "lokasi" SET NOT NULL;

-- DropTable
DROP TABLE "informasi";

-- CreateTable
CREATE TABLE "informasi_edukasi" (
    "id" UUID NOT NULL,
    "judul" VARCHAR NOT NULL,
    "tipe" VARCHAR NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "file_name" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "user_id" UUID NOT NULL,

    CONSTRAINT "informasi_edukasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pasien" (
    "id" UUID NOT NULL,
    "nama" VARCHAR,
    "jenis_kelamin" VARCHAR,
    "umur" INTEGER,
    "jenis_difasilitas" VARCHAR,
    "file_foto" VARCHAR,
    "odgj" BOOLEAN,
    "tanggal_lahir" TIMESTAMP(6),
    "alamat" VARCHAR,
    "no_telp" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "user_posyandu" UUID NOT NULL,

    CONSTRAINT "pasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_pasien" (
    "id" UUID NOT NULL,
    "pasien_id" UUID NOT NULL,
    "titik_koordinat" VARCHAR,
    "keterangan" TEXT,
    "potensi" TEXT,
    "minat" TEXT,
    "status" VARCHAR,
    "bakat" TEXT,
    "keterampilan" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "detail_pasien_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "informasi_edukasi" ADD CONSTRAINT "informasi_edukasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pasien" ADD CONSTRAINT "pasien_user_posyandu_fkey" FOREIGN KEY ("user_posyandu") REFERENCES "users_posyandu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detail_pasien" ADD CONSTRAINT "detail_pasien_pasien_id_fkey" FOREIGN KEY ("pasien_id") REFERENCES "pasien"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
