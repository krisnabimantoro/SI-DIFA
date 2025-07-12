/*
  Warnings:

  - You are about to drop the column `file_foto` on the `pasien` table. All the data in the column will be lost.
  - You are about to drop the column `odgj` on the `pasien` table. All the data in the column will be lost.
  - Added the required column `odgj` to the `detail_pasien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nika` to the `pasien` table without a default value. This is not possible if the table is not empty.
  - Made the column `jenis_difasilitas` on table `pasien` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "detail_pasien" ADD COLUMN     "file_foto" VARCHAR,
ADD COLUMN     "odgj" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "pasien" DROP COLUMN "file_foto",
DROP COLUMN "odgj",
ADD COLUMN     "nika" BIGINT NOT NULL,
ALTER COLUMN "jenis_difasilitas" SET NOT NULL;
