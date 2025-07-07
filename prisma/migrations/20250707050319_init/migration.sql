-- CreateTable
CREATE TABLE "posyandu" (
    "id" UUID NOT NULL,
    "lokasi" VARCHAR,
    "user_id" UUID NOT NULL,

    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psikolog" (
    "id" UUID NOT NULL,
    "lokasi" VARCHAR,
    "spesialis" VARCHAR,
    "user_id" UUID NOT NULL,

    CONSTRAINT "psikolog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "no_telp" VARCHAR,
    "role" VARCHAR,
    "verification" VARCHAR,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posyandu" ADD CONSTRAINT "posyandu_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "psikolog" ADD CONSTRAINT "psikolog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
