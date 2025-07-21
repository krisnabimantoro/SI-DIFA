import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  await prisma.jenis_difasilitas.createMany({
    data: [
      {
        id: crypto.randomUUID(),
        nama: 'Fisik',
        deskripsi: 'Keterbatasan dalam pergerakan tubuh atau fungsi fisik.',
        created_at: now,
      },
      {
        id: crypto.randomUUID(),
        nama: 'Intelektual',
        deskripsi:
          'Gangguan perkembangan fungsi intelektual yang memengaruhi kemampuan belajar.',
        created_at: now,
      },
      {
        id: crypto.randomUUID(),
        nama: 'Menatal (Termasuk ODGJ)',
        deskripsi:
          'Gangguan mental atau psikososial termasuk orang dengan gangguan jiwa (ODGJ).',
        created_at: now,
      },
      {
        id: crypto.randomUUID(),
        nama: 'Sensorik Penglihatan',
        deskripsi: 'Keterbatasan atau kehilangan fungsi penglihatan.',
        created_at: now,
      },
      {
        id: crypto.randomUUID(),
        nama: 'Sensorik rungu',
        deskripsi: 'Gangguan atau kehilangan fungsi pendengaran.',
        created_at: now,
      },
    ],
  });

  console.log('✅ Seed berhasil dimasukkan.');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi error saat menjalankan seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
