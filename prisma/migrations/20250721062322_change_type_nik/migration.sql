/*
  Warnings:

  - You are about to alter the column `nik` on the `ibk` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ibk" ALTER COLUMN "nik" SET DATA TYPE INTEGER;
