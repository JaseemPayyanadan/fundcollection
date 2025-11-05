'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Contributor {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  paymentStatus: string;
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

export default function Home() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = (coll: Collection) => {
    return coll.contributors.reduce((sum, c) => sum + c.amount, 0);
  };

  const getTotalPaid = (coll: Collection) => {
    return coll.contributors.reduce((sum, c) => sum + c.paidAmount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Fund Collection App
          </h1>
          <p className="text-gray-600 mb-6">Manage your fund collections with ease</p>
          
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Create New Collection
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No collections yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((coll) => (
              <div
                key={coll.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/view/${coll.id}`)}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <h3 className="text-xl font-bold text-white truncate">{coll.name}</h3>
                </div>
                <div className="p-4">
                  {coll.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{coll.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Contributors:</span>
                      <span className="font-semibold text-gray-800">{coll.contributors.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Amount:</span>
                      <span className="font-semibold text-gray-800">₹{getTotalAmount(coll).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Paid:</span>
                      <span className="font-semibold text-green-600">₹{getTotalPaid(coll).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/${coll.id}`);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Manage
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/view/${coll.id}`);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
