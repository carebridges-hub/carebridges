import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user || user.password !== password) {
      return { 
        statusCode: 401, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid email or password' }) 
      };
    }

    const token = await new jose.SignJWT({ id: user.id, role: user.role, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token, 
        user: { id: user.id, email: user.email, role: user.role, name: user.name } 
      }),
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }) 
    };
  }
};
