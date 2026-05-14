import { db } from '../../src/db';
import { complaints, auditLogs, dispositions } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';
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
  const { whatsapp: trackWhatsapp } = event.queryStringParameters || {};
  const authHeader = event.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? await verifyToken(token) : null;

  // GET: List or Track complaints
  if (event.httpMethod === 'GET') {
    if (trackWhatsapp) {
      try {
        const result = await db.select().from(complaints)
          .where(eq(complaints.whatsapp, trackWhatsapp))
          .orderBy(desc(complaints.createdAt));
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        };
      } catch (error: any) {
        return { statusCode: 500, body: error.message };
      }
    }

    if (!user) return { statusCode: 401, body: 'Unauthorized' };
    
    try {
      const allComplaints = await db.select().from(complaints).orderBy(desc(complaints.createdAt));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allComplaints),
      };
    } catch (error: any) {
      return { statusCode: 500, body: error.message };
    }
  }

  // POST: Create complaint
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      const [newComplaint] = await db.insert(complaints).values({
        patientName: data.patientName,
        whatsapp: data.whatsapp,
        unit: data.unit,
        content: data.content,
        status: 'pending',
      }).returning();

      await db.insert(auditLogs).values({
        complaintId: newComplaint.id,
        action: 'Patient Submitted',
        notes: `Complaint submitted via E-Complaint form for unit ${data.unit}`,
      });

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint),
      };
    } catch (error: any) {
      return { statusCode: 500, body: error.message };
    }
  }

  // PATCH: Update complaint
  if (event.httpMethod === 'PATCH') {
    if (!user) return { statusCode: 401, body: 'Unauthorized' };
    
    try {
      const { id, status, targetUnit, adminNotes } = JSON.parse(event.body);
      await db.update(complaints).set({ status, updatedAt: new Date() }).where(eq(complaints.id, id));

      if (targetUnit) {
        await db.insert(dispositions).values({
          complaintId: id,
          targetUnit,
          adminNotes,
          adminId: user.id as string,
        });
      }

      await db.insert(auditLogs).values({
        complaintId: id,
        action: `Status updated to ${status}`,
        actorId: user.id as string,
        notes: adminNotes || `Updated by ${user.name}`,
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Updated successfully' }),
      };
    } catch (error: any) {
      return { statusCode: 500, body: error.message };
    }
  }

  // DELETE: Remove complaint (Admin only)
  // FIX: Delete related records first to satisfy foreign key constraints
  if (event.httpMethod === 'DELETE') {
    if (!user || user.role !== 'admin') return { statusCode: 401, body: 'Unauthorized' };
    const { id } = event.queryStringParameters || {};
    if (!id) return { statusCode: 400, body: 'Missing ID' };

    try {
      // 1. Delete Dispositions
      await db.delete(dispositions).where(eq(dispositions.complaintId, id));
      // 2. Delete Audit Logs
      await db.delete(auditLogs).where(eq(auditLogs.complaintId, id));
      // 3. Delete Complaint
      await db.delete(complaints).where(eq(complaints.id, id));

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Deleted successfully' }),
      };
    } catch (error: any) {
      return { statusCode: 500, body: `Delete failed: ${error.message}` };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
