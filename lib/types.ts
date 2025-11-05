export type PaymentStatus = 'pending' | 'paid' | 'partially_paid';

export interface Contributor {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  addedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  targetAmount?: number;
  contributors: Contributor[];
  createdAt: Date;
  updatedAt: Date;
}
