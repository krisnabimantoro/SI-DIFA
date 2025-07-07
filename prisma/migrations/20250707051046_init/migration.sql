/*
  Warnings:

  - You are about to drop the `posyandu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `psikolog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posyandu" DROP CONSTRAINT "posyandu_user_id_fkey";

-- DropForeignKey
ALTER TABLE "psikolog" DROP CONSTRAINT "psikolog_user_id_fkey";

-- DropTable
DROP TABLE "posyandu";

-- DropTable
DROP TABLE "psikolog";

-- CreateTable
CREATE TABLE "users_posyandu" (
    "id" UUID NOT NULL,
    "lokasi" VARCHAR,
    "user_id" UUID NOT NULL,

    CONSTRAINT "users_posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_psikolog" (
    "id" UUID NOT NULL,
    "lokasi" VARCHAR,
    "spesialis" VARCHAR,
    "user_id" UUID NOT NULL,

    CONSTRAINT "users_psikolog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_posyandu" ADD CONSTRAINT "users_posyandu_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_psikolog" ADD CONSTRAINT "users_psikolog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
