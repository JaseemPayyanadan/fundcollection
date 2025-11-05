import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// GET all collections
export async function GET() {
  try {
    const { rows: collections } = await sql`
      SELECT * FROM collections ORDER BY created_at DESC
    `;

    // Get contributors for each collection
    const collectionsWithContributors = await Promise.all(
      collections.map(async (collection) => {
        const { rows: contributors } = await sql`
          SELECT * FROM contributors 
          WHERE collection_id = ${collection.id}
          ORDER BY added_at DESC
        `;

        return {
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
        };
      })
    );

    return NextResponse.json(collectionsWithContributors);
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new collection
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, targetAmount } = body;

    const { rows } = await sql`
      INSERT INTO collections (name, description, target_amount, created_at, updated_at)
      VALUES (${name}, ${description || ''}, ${targetAmount || 0}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const collection = rows[0];

    return NextResponse.json({
      id: collection.id.toString(),
      name: collection.name,
      description: collection.description,
      targetAmount: parseFloat(collection.target_amount || '0'),
      contributors: [],
      createdAt: new Date(collection.created_at),
      updatedAt: new Date(collection.updated_at)
    });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

