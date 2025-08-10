import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedJenisDisabilitas() {
  const jenisDisabilitasData = [
    {
      id: 'b8afb93f-0232-45b7-9c9f-c2063215a8f2',
      nama: 'Fisik',
      deskripsi: 'Keterbatasan dalam pergerakan tubuh atau fungsi fisik.',
    },
    {
      id: '889c26c0-1624-4280-aa05-f28ae71816db',
      nama: 'Intelektual',
      deskripsi:
        'Gangguan perkembangan fungsi intelektual yang memengaruhi kemampuan belajar.',
    },
    {
      id: '6f469ea4-974a-4240-b062-693acbd47d17',
      nama: 'Mental (Termasuk ODGJ)',
      deskripsi:
        'Gangguan mental atau psikososial termasuk orang dengan gangguan jiwa (ODGJ).',
    },
    {
      id: '9e8c9f6d-3e05-4b62-a9df-768effa0316d',
      nama: 'Sensorik Penglihatan',
      deskripsi: 'Keterbatasan atau kehilangan fungsi penglihatan.',
    },
    {
      id: '712e4398-c116-4040-a762-bd3bc44ab835',
      nama: 'Sensorik Rungu',
      deskripsi: 'Gangguan atau kehilangan fungsi pendengaran.',
    },
  ];

  console.log('Seeding jenis disabilitas...');

  for (const jenis of jenisDisabilitasData) {
    await prisma.jenis_difasilitas.upsert({
      where: { id: jenis.id },
      update: {
        nama: jenis.nama,
        deskripsi: jenis.deskripsi,
        updated_at: new Date(),
      },
      create: {
        id: jenis.id,
        nama: jenis.nama,
        deskripsi: jenis.deskripsi,
        created_at: new Date(),
      },
    });
  }

  console.log('Jenis disabilitas seeded successfully!');
}

seedJenisDisabilitas()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
