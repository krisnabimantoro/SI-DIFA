-- AlterTable
ALTER TABLE "ibk" ADD COLUMN     "posyanduId" UUID;

-- AddForeignKey
ALTER TABLE "ibk" ADD CONSTRAINT "ibk_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
