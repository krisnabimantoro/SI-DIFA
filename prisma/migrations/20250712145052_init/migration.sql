-- CreateTable
CREATE TABLE "lowongan" (
    "id" UUID NOT NULL,
    "nama_lowongan" VARCHAR,
    "jenis_difasilitas" VARCHAR,
    "jenis_pekerjaan" VARCHAR,
    "nama_perusahaan" VARCHAR,
    "lokasi" VARCHAR,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "user_id" UUID NOT NULL,

    CONSTRAINT "lowongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informasi" (
    "id" UUID NOT NULL,
    "judul" VARCHAR,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "user_id" UUID NOT NULL,

    CONSTRAINT "informasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lowongan" ADD CONSTRAINT "lowongan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "informasi" ADD CONSTRAINT "informasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
