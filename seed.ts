import { db } from './src/db';
import { users, complaints } from './src/db/schema';
import pkg from 'pg';
const { Client } = pkg;

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data (optional, but good for fresh start)
    // await db.delete(users);

    // Create initial users
    await db.insert(users).values([
      {
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin Sarpras',
        role: 'admin',
      },
      {
        email: 'user@test.com',
        password: 'password123',
        name: 'Staf Unit',
        role: 'staff',
      },
      {
        email: 'teknisi@test.com',
        password: 'password123',
        name: 'Teknisi Utama',
        role: 'technician',
      },
    ]).onConflictDoNothing();

    // Create some initial complaints
    await db.insert(complaints).values([
      {
        patientName: 'Bp. Ahmad',
        whatsapp: '6281234567890',
        unit: 'Ranap',
        content: 'Lantai di koridor Mawar licin.',
        status: 'pending',
      },
      {
        patientName: 'Ibu Siti',
        whatsapp: '6281234567891',
        unit: 'Poli',
        content: 'AC di ruang tunggu Poli Gigi mati.',
        status: 'verified',
      },
    ]);

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
