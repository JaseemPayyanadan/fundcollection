import { sql } from '@vercel/postgres';

export interface Contributor {
  id: string;
  name: string;
  amount: number;
  paid_amount: number;
  payment_status: 'pending' | 'paid' | 'partially_paid';
  added_at: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  target_amount?: number;
  contributors: Contributor[];
  created_at: Date;
  updated_at: Date;
}

// Initialize database tables
export async function initDB() {
  try {
    // Create collections table
    await sql`
      CREATE TABLE IF NOT EXISTS collections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        target_amount DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create contributors table
    await sql`
      CREATE TABLE IF NOT EXISTS contributors (
        id SERIAL PRIMARY KEY,
        collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
        contributor_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        paid_amount DECIMAL(10, 2) DEFAULT 0,
        payment_status VARCHAR(20) DEFAULT 'pending',
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

