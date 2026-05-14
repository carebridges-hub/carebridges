import { db } from './src/db';
import { users } from './src/db/schema';

async function check() {
  const allUsers = await db.select().from(users);
  console.log('Users in DB:', allUsers.map(u => ({ email: u.email, role: u.role, name: u.name })));
  process.exit(0);
}

check();
