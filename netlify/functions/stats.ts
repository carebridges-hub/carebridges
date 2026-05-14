import { db } from '../../src/db';
import { complaints } from '../../src/db/schema';
import { sql } from 'drizzle-orm';
import * as jose from 'jose';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

const UNITS = [
  'Poli Umum', 'Poli Jiwa', 'Poli KIA', 'UGD', 'Poli Persalinan', 
  'Poli KB', 'Poli Gizi', 'Poli Gigi & Mulut', 'Laboratorium', 
  'Poli Lansia', 'Poli TB & Paru', 'Kunjungan Online', 'Home-Visit', 
  'Poli HIV & IMS'
];

export const handler = async (event: any) => {
  const authHeader = event.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? await verifyToken(token) : null;

  if (!user) return { statusCode: 401, body: 'Unauthorized' };

  try {
    // Status Summary
    const statsRes = await db.select({
      status: complaints.status,
      count: sql<number>`cast(count(*) as integer)`,
    }).from(complaints).groupBy(complaints.status);

    const totalRes = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(complaints);
    const total = totalRes[0]?.count || 0;
    
    // Trend by unit
    const dbUnitTrend = await db.select({
      unit: complaints.unit,
      count: sql<number>`cast(count(*) as integer)`,
    }).from(complaints).groupBy(complaints.unit);

    // Merge with all units to ensure 0s are shown
    const unitTrend = UNITS.map(unit => {
      const found = dbUnitTrend.find(u => u.unit === unit);
      return { unit, count: found ? found.count : 0 };
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: statsRes,
        total: total,
        unitTrend
      }),
    };
  } catch (error: any) {
    return { statusCode: 500, body: error.message };
  }
};
