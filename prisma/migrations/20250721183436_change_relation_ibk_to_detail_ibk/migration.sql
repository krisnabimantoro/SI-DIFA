/*
  Warnings:

  - You are about to drop the column `ibk_id` on the `detail_ibk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_ibk" DROP CONSTRAINT "detail_ibk_ibk_id_fkey";

-- AlterTable
ALTER TABLE "detail_ibk" DROP COLUMN "ibk_id";

-- AlterTable
ALTER TABLE "ibk" ADD COLUMN     "detail_ibk_id" UUID;

-- AddForeignKey
ALTER TABLE "ibk" ADD CONSTRAINT "ibk_detail_ibk_id_fkey" FOREIGN KEY ("detail_ibk_id") REFERENCES "detail_ibk"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
