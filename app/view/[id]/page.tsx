'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type PaymentStatus = 'pending' | 'paid' | 'partially_paid';

interface Contributor {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  addedAt: Date;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  targetAmount?: number;
  contributors: Contributor[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ViewCollection() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`);
      if (!response.ok) throw new Error('Failed to fetch collection');
      const data = await response.json();
      setCollection(data);
    } catch (error) {
      console.error('Error loading collection:', error);
      alert('Collection not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'partially_paid':
        return 'Partially Paid';
      default:
        return 'Pending';
    }
  };

  const getTotalAmount = () => {
    return collection?.contributors.reduce((sum, c) => sum + c.amount, 0) || 0;
  };

  const getTotalPaid = () => {
    return collection?.contributors.reduce((sum, c) => sum + c.paidAmount, 0) || 0;
  };

  const getPaidCount = () => {
    return collection?.contributors.filter(c => c.paymentStatus === 'paid').length || 0;
  };

  const getPartiallyPaidCount = () => {
    return collection?.contributors.filter(c => c.paymentStatus === 'partially_paid').length || 0;
  };

  const getPendingCount = () => {
    return collection?.contributors.filter(c => c.paymentStatus === 'pending').length || 0;
  };

  const getProgressPercentage = () => {
    const total = getTotalAmount();
    if (total === 0) return 0;
    return Math.round((getTotalPaid() / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{collection.name}</h1>
            {collection.description && (
              <p className="text-gray-600 text-lg">{collection.description}</p>
            )}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Collection Progress</span>
              <span className="text-sm font-bold text-blue-600">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Contributors</p>
              <p className="text-3xl font-bold text-blue-600">{collection.contributors.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">₹{getTotalAmount().toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">₹{getTotalPaid().toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{getPaidCount()}</p>
              <p className="text-xs text-gray-600">Paid</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{getPartiallyPaidCount()}</p>
              <p className="text-xs text-gray-600">Partial</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{getPendingCount()}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contributors List</h2>
          
          {collection.contributors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No contributors yet.</p>
          ) : (
            <div className="space-y-3">
              {collection.contributors
                .sort((a, b) => {
                  const statusOrder = { paid: 0, partially_paid: 1, pending: 2 };
                  return statusOrder[a.paymentStatus] - statusOrder[b.paymentStatus];
                })
                .map((contributor) => (
                  <div
                    key={contributor.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{contributor.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>Amount: <span className="font-semibold">₹{contributor.amount.toLocaleString()}</span></span>
                          <span>Paid: <span className="font-semibold text-green-600">₹{contributor.paidAmount.toLocaleString()}</span></span>
                          {contributor.paidAmount < contributor.amount && (
                            <span>Remaining: <span className="font-semibold text-orange-600">₹{(contributor.amount - contributor.paidAmount).toLocaleString()}</span></span>
                          )}
                        </div>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(contributor.paymentStatus)}`}>
                        {getStatusLabel(contributor.paymentStatus)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Last updated: {new Date(collection.updatedAt).toLocaleDateString()} {new Date(collection.updatedAt).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
