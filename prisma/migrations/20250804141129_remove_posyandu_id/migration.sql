/*
  Warnings:

  - You are about to drop the column `posyandu_id` on the `presensi_ibk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "presensi_ibk" DROP CONSTRAINT "presensi_ibk_posyandu_id_fkey";

-- AlterTable
ALTER TABLE "presensi_ibk" DROP COLUMN "posyandu_id";
