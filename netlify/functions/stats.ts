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

export const handler = async (event: any) => {
  const authHeader = event.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? await verifyToken(token) : null;

  if (!user) return { statusCode: 401, body: 'Unauthorized' };

  try {
    const stats = await db.select({
      status: complaints.status,
      count: sql<number>`count(*)`,
    }).from(complaints).groupBy(complaints.status);

    const total = await db.select({ count: sql<number>`count(*)` }).from(complaints);
    
    // Trend by unit
    const unitTrend = await db.select({
      unit: complaints.unit,
      count: sql<number>`count(*)`,
    }).from(complaints).groupBy(complaints.unit);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: stats,
        total: total[0].count,
        unitTrend
      }),
    };
  } catch (error: any) {
    return { statusCode: 500, body: error.message };
  }
};
