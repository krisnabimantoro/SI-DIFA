/*
  Warnings:

  - You are about to drop the column `hadir` on the `presensi_ibk` table. All the data in the column will be lost.
  - You are about to drop the column `hadir` on the `presensi_kader` table. All the data in the column will be lost.
  - You are about to drop the column `posyandu_id` on the `presensi_kader` table. All the data in the column will be lost.
  - Added the required column `status_presensi` to the `presensi_ibk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_presensi` to the `presensi_kader` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "presensi_kader" DROP CONSTRAINT "presensi_kader_posyandu_id_fkey";

-- AlterTable
ALTER TABLE "presensi_ibk" DROP COLUMN "hadir",
ADD COLUMN     "status_presensi" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "presensi_kader" DROP COLUMN "hadir",
DROP COLUMN "posyandu_id",
ADD COLUMN     "status_presensi" VARCHAR NOT NULL;
