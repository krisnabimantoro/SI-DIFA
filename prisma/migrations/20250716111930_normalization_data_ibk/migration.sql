/*
  Warnings:

  - You are about to drop the column `bakat` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `file_foto` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `hasil_diagnosa` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_bantuan` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `keterampilan` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `minat` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `odgj` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `potensi` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `detail_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_difasilitas` on the `ibk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "detail_ibk" DROP COLUMN "bakat",
DROP COLUMN "file_foto",
DROP COLUMN "hasil_diagnosa",
DROP COLUMN "jenis_bantuan",
DROP COLUMN "keterampilan",
DROP COLUMN "minat",
DROP COLUMN "odgj",
DROP COLUMN "potensi",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "disabilitas_ibk" ADD COLUMN     "sejak_kapan" TIMESTAMP(6),
ADD COLUMN     "tingkat_keparahan" VARCHAR;

-- AlterTable
ALTER TABLE "ibk" DROP COLUMN "jenis_difasilitas",
ADD COLUMN     "agama" VARCHAR,
ADD COLUMN     "assesmen_ibk_id" UUID,
ADD COLUMN     "file_foto" VARCHAR,
ADD COLUMN     "kesehatan_ibk_id" UUID,
ADD COLUMN     "tempat_lahir" VARCHAR;

-- CreateTable
CREATE TABLE "assesmen_ibk" (
    "id" UUID NOT NULL,
    "total_iq" INTEGER,
    "kategori_iq" VARCHAR,
    "tipe_kepribadian" TEXT,
    "deskripsi_kepribadian" TEXT,
    "potensi" TEXT,
    "minat" TEXT,
    "bakat" TEXT,
    "keterampilan" TEXT,
    "catatan_psikolog" TEXT,
    "rekomendasi_intervensi" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "assesmen_ibk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kesehatan_ibk" (
    "id" UUID NOT NULL,
    "odgj" BOOLEAN NOT NULL,
    "hasil_diagnosa" TEXT,
    "jenis_bantuan" VARCHAR,
    "riwayat_terapi" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "kesehatan_ibk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ibk" ADD CONSTRAINT "ibk_assesmen_ibk_id_fkey" FOREIGN KEY ("assesmen_ibk_id") REFERENCES "assesmen_ibk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ibk" ADD CONSTRAINT "ibk_kesehatan_ibk_id_fkey" FOREIGN KEY ("kesehatan_ibk_id") REFERENCES "kesehatan_ibk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
