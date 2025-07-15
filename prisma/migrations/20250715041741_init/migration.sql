-- AlterTable
ALTER TABLE "detail_ibk" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "disabilitas_ibk" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "ibk" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "informasi_edukasi" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "jadwal_posyandu" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "jenis_difasilitas" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "kader_posyandu" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "lowongan" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "monitoring_ibk" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "posyandu" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "presensi_ibk" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "presensi_kader" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "updated_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users_kader" ADD COLUMN     "created_at" TIMESTAMP(6),
ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "updated_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users_psikolog" ADD COLUMN     "created_at" TIMESTAMP(6),
ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "updated_at" TIMESTAMP(6);
