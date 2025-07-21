/*
  Warnings:

  - You are about to drop the column `users_kaderId` on the `ibk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ibk" DROP CONSTRAINT "ibk_users_kaderId_fkey";

-- AlterTable
ALTER TABLE "ibk" DROP COLUMN "users_kaderId",
ADD COLUMN     "users_kader_id" UUID,
ALTER COLUMN "nik" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "ibk" ADD CONSTRAINT "ibk_users_kader_id_fkey" FOREIGN KEY ("users_kader_id") REFERENCES "users_kader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
