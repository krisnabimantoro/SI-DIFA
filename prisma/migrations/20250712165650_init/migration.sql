/*
  Warnings:

  - You are about to drop the column `nika` on the `pasien` table. All the data in the column will be lost.
  - Added the required column `nik` to the `pasien` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pasien" DROP COLUMN "nika",
ADD COLUMN     "nik" BIGINT NOT NULL;
