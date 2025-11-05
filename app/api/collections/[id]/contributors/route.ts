import { query } from '@/lib/postgres';
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

    await query(
      'INSERT INTO contributors (collection_id, contributor_id, name, amount, paid_amount, payment_status, added_at) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)',
      [params.id, contributorId, name, amount, 0, 'pending']
    );

    // Update collection updated_at
    await query(
      'UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [params.id]
    );

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

    await query(
      'UPDATE contributors SET paid_amount = $1, payment_status = $2 WHERE collection_id = $3 AND contributor_id = $4',
      [paidAmount, paymentStatus, params.id, contributorId]
    );

    // Update collection updated_at
    await query(
      'UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating contributor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

