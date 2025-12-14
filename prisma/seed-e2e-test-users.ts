import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('🌱 Seeding test users for E2E testing...');

  const saltRounds = 10;

  // Hash password for all test users
  const hashedPassword = await bcrypt.hash('Password123', saltRounds);

  try {
    // 1. Verified Kader
    const verifiedKader = await prisma.users.upsert({
      where: { email: 'kader.verified@test.com' },
      update: {},
      create: {
        email: 'kader.verified@test.com',
        password: hashedPassword,
        name: 'Kader Verified',
        no_telp: '081234567890',
        role: 'kader',
        verification: 'approved',
        created_at: new Date(),
        users_kader: {
          create: {
            jabatan: 'Ketua Kader',
            created_at: new Date(),
          },
        },
      },
    });
    console.log('✅ Created verified kader:', verifiedKader.email);

    // 2. Unverified Kader
    const unverifiedKader = await prisma.users.upsert({
      where: { email: 'kader.unverified@test.com' },
      update: {},
      create: {
        email: 'kader.unverified@test.com',
        password: hashedPassword,
        name: 'Kader Unverified',
        no_telp: '081234567891',
        role: 'kader',
        verification: 'unverified',
        created_at: new Date(),
        users_kader: {
          create: {
            jabatan: 'Anggota Kader',
            created_at: new Date(),
          },
        },
      },
    });
    console.log('✅ Created unverified kader:', unverifiedKader.email);

    // 3. Declined Kader
    const declinedKader = await prisma.users.upsert({
      where: { email: 'kader.declined@test.com' },
      update: {},
      create: {
        email: 'kader.declined@test.com',
        password: hashedPassword,
        name: 'Kader Declined',
        no_telp: '081234567892',
        role: 'kader',
        verification: 'declined',
        created_at: new Date(),
        users_kader: {
          create: {
            jabatan: 'Sekretaris Kader',
            created_at: new Date(),
          },
        },
      },
    });
    console.log('✅ Created declined kader:', declinedKader.email);

    // 4. Admin User
    const adminHashedPassword = await bcrypt.hash('Admin123', saltRounds);
    const adminUser = await prisma.users.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: adminHashedPassword,
        name: 'Admin User',
        no_telp: '081234567999',
        role: 'admin',
        verification: 'approved',
        created_at: new Date(),
      },
    });
    console.log('✅ Created admin user:', adminUser.email);

    // 5. Create test posyandu for jadwal testing
    // Check if posyandu already exists
    let testPosyandu = await prisma.posyandu.findFirst({
      where: { nama_posyandu: 'Posyandu Testing E2E' },
    });

    if (!testPosyandu) {
      testPosyandu = await prisma.posyandu.create({
        data: {
          nama_posyandu: 'Posyandu Testing E2E',
          alamat: 'Jl. Testing No. 123',
          no_telp: '0211234567',
          created_at: new Date(),
        },
      });
    }
    console.log('✅ Created test posyandu:', testPosyandu.nama_posyandu);

    // 6. Get users_kader record for verified kader
    const verifiedKaderRecord = await prisma.users_kader.findFirst({
      where: { user_id: verifiedKader.id },
    });

    if (!verifiedKaderRecord) {
      throw new Error('Verified kader record not found in users_kader table');
    }

    // 7. Link verified kader to posyandu
    // Check if link already exists
    let kaderPosyandu = await prisma.kader_posyandu.findFirst({
      where: {
        user_kader_id: verifiedKaderRecord.id,
        posyandu_id: testPosyandu.id,
      },
    });

    if (!kaderPosyandu) {
      kaderPosyandu = await prisma.kader_posyandu.create({
        data: {
          user_kader_id: verifiedKaderRecord.id,
          posyandu_id: testPosyandu.id,
          created_at: new Date(),
        },
      });
    }
    console.log('✅ Linked kader to posyandu');

    // 8. Create some test IBK for presensi testing
    for (let i = 1; i <= 5; i++) {
      const existingIbk = await prisma.ibk.findFirst({
        where: {
          nama: `IBK Test ${i}`,
          posyanduId: testPosyandu.id,
        },
      });

      if (!existingIbk) {
        await prisma.ibk.create({
          data: {
            nama: `IBK Test ${i}`,
            nik: 3301002003004 + i,
            posyanduId: testPosyandu.id,
            users_kader_id: verifiedKaderRecord.id,
            created_at: new Date(),
          },
        });
      }
    }
    console.log('✅ Created 5 test IBK records');

    console.log('\n🎉 Test user seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('-----------------------------------');
    console.log('Verified Kader:');
    console.log('  Email: kader.verified@test.com');
    console.log('  Password: Password123');
    console.log('\nUnverified Kader:');
    console.log('  Email: kader.unverified@test.com');
    console.log('  Password: Password123');
    console.log('\nDeclined Kader:');
    console.log('  Email: kader.declined@test.com');
    console.log('  Password: Password123');
    console.log('\nAdmin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: Admin123');
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    throw error;
  }
}

async function main() {
  try {
    await createTestUsers();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { createTestUsers };
