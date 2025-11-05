import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// POST add contributor
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, amount } = body;
    const contributorId = uuidv4();

    await sql`
      INSERT INTO contributors (collection_id, contributor_id, name, amount, paid_amount, payment_status, added_at)
      VALUES (${params.id}, ${contributorId}, ${name}, ${amount}, 0, 'pending', CURRENT_TIMESTAMP)
    `;

    // Update collection updated_at
    await sql`
      UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, id: contributorId });
  } catch (error: any) {
    console.error('Error adding contributor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update contributor payment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { contributorId, paidAmount, paymentStatus } = body;

    await sql`
      UPDATE contributors 
      SET paid_amount = ${paidAmount}, 
          payment_status = ${paymentStatus}
      WHERE collection_id = ${params.id} 
        AND contributor_id = ${contributorId}
    `;

    // Update collection updated_at
    await sql`
      UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating contributor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

