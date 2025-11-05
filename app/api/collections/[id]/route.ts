import { query } from '@/lib/postgres';
import { NextResponse } from 'next/server';

// GET single collection
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows: collections } = await query(
      'SELECT * FROM collections WHERE id = $1',
      [params.id]
    );

    if (collections.length === 0) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const collection = collections[0];

    const { rows: contributors } = await query(
      'SELECT * FROM contributors WHERE collection_id = $1 ORDER BY added_at DESC',
      [params.id]
    );

    return NextResponse.json({
      id: collection.id.toString(),
      name: collection.name,
      description: collection.description,
      targetAmount: parseFloat(collection.target_amount || '0'),
      contributors: contributors.map(c => ({
        id: c.contributor_id,
        name: c.name,
        amount: parseFloat(c.amount),
        paidAmount: parseFloat(c.paid_amount),
        paymentStatus: c.payment_status,
        addedAt: new Date(c.added_at)
      })),
      createdAt: new Date(collection.created_at),
      updatedAt: new Date(collection.updated_at)
    });
  } catch (error: any) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

