'use client';

import { DebtHistory } from '@/lib/types';

interface PaymentHistoryProps {
  history: DebtHistory[];
  onClose: () => void;
}

export default function PaymentHistory({ history, onClose }: PaymentHistoryProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Payment History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No history available</p>
          ) : (
            <ul className="space-y-4">
              {history
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => (
                  <li
                    key={item.id}
                    className="border-l-4 pl-4 py-2"
                    style={{
                      borderColor:
                        item.type === 'payment' ? '#10B981' : '#F59E0B',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.type === 'payment' ? 'Payment' : 'Debt Increase'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          item.type === 'payment'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {item.type === 'payment' ? '-' : '+'}฿{item.amount}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-sm text-gray-500 mt-1">{item.note}</p>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}