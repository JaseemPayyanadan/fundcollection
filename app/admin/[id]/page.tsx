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

export default function ManageCollection() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);

  // Form states
  const [contributorName, setContributorName] = useState('');
  const [contributorAmount, setContributorAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

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

  const handleAddContributor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName.trim() || !contributorAmount) return;

    const amount = parseFloat(contributorAmount);
    if (amount <= 0) return;

    try {
      const response = await fetch(`/api/collections/${collectionId}/contributors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contributorName.trim(),
          amount: amount,
        }),
      });

      if (!response.ok) throw new Error('Failed to add contributor');

      setContributorName('');
      setContributorAmount('');
      setShowAddModal(false);
      loadCollection();
    } catch (error) {
      console.error('Error adding contributor:', error);
      alert('Failed to add contributor');
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContributor || !collection) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount < 0) return;

    try {
      const newPaidAmount = selectedContributor.paidAmount + amount;
      let newStatus: PaymentStatus = 'pending';
      
      if (newPaidAmount >= selectedContributor.amount) {
        newStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'partially_paid';
      }

      const response = await fetch(`/api/collections/${collectionId}/contributors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributorId: selectedContributor.id,
          paidAmount: Math.min(newPaidAmount, selectedContributor.amount),
          paymentStatus: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update payment');

      setPaymentAmount('');
      setSelectedContributor(null);
      setShowPaymentModal(false);
      loadCollection();
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment');
    }
  };

  const handleUpdateStatus = async (contributorId: string, newStatus: PaymentStatus) => {
    if (!collection) return;

    try {
      const contributor = collection.contributors.find(c => c.id === contributorId);
      if (!contributor) return;

      let paidAmount = contributor.paidAmount;
      if (newStatus === 'paid') {
        paidAmount = contributor.amount;
      } else if (newStatus === 'pending') {
        paidAmount = 0;
      }

      const response = await fetch(`/api/collections/${collectionId}/contributors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributorId,
          paidAmount,
          paymentStatus: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      loadCollection();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const openPaymentModal = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setPaymentAmount('');
    setShowPaymentModal(true);
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => router.push(`/view/${collectionId}`)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View Public Page →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{collection.name}</h1>
              {collection.description && (
                <p className="text-gray-600">{collection.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Contributors</p>
              <p className="text-2xl font-bold text-blue-600">{collection.contributors.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">₹{getTotalAmount().toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">₹{getTotalPaid().toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">₹{(getTotalAmount() - getTotalPaid()).toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            + Add Contributor
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contributors</h2>
          
          {collection.contributors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No contributors yet. Add your first contributor!</p>
          ) : (
            <div className="space-y-4">
              {collection.contributors.map((contributor) => (
                <div
                  key={contributor.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{contributor.name}</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          Amount: <span className="font-semibold">₹{contributor.amount.toLocaleString()}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Paid: <span className="font-semibold text-green-600">₹{contributor.paidAmount.toLocaleString()}</span>
                        </p>
                        {contributor.paidAmount < contributor.amount && (
                          <p className="text-sm text-gray-600">
                            Remaining: <span className="font-semibold text-orange-600">₹{(contributor.amount - contributor.paidAmount).toLocaleString()}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${getStatusColor(contributor.paymentStatus)}`}>
                        {getStatusLabel(contributor.paymentStatus)}
                      </span>
                      
                      <div className="flex flex-wrap gap-2">
                        {contributor.paymentStatus !== 'paid' && (
                          <>
                            <button
                              onClick={() => openPaymentModal(contributor)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition"
                            >
                              Add Payment
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(contributor.id, 'paid')}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition"
                            >
                              Mark Paid
                            </button>
                          </>
                        )}
                        {contributor.paymentStatus === 'paid' && (
                          <button
                            onClick={() => handleUpdateStatus(contributor.id, 'pending')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded transition"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Contributor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Contributor</h2>
            <form onSubmit={handleAddContributor} className="space-y-4">
              <div>
                <label htmlFor="contributorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contributorName"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="Enter contributor name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="contributorAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="contributorAmount"
                  value={contributorAmount}
                  onChange={(e) => setContributorAmount(e.target.value)}
                  placeholder="0"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedContributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Payment</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Contributor: <span className="font-semibold">{selectedContributor.name}</span></p>
              <p className="text-sm text-gray-600">Total Amount: <span className="font-semibold">₹{selectedContributor.amount}</span></p>
              <p className="text-sm text-gray-600">Already Paid: <span className="font-semibold text-green-600">₹{selectedContributor.paidAmount}</span></p>
              <p className="text-sm text-gray-600">Remaining: <span className="font-semibold text-orange-600">₹{selectedContributor.amount - selectedContributor.paidAmount}</span></p>
            </div>
            <form onSubmit={handleUpdatePayment} className="space-y-4">
              <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0"
                  required
                  min="0.01"
                  step="0.01"
                  max={selectedContributor.amount - selectedContributor.paidAmount}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Add Payment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedContributor(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
