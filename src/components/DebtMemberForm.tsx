'use client';

import { useState, useEffect } from 'react';
import { DebtMember } from '@/lib/types';
import { useDebt } from '@/contexts/DebtContext';
import PaymentHistory from './PaymentHistory';

interface DebtMemberFormProps {
  sectionId: string;
  member: DebtMember;
  isRecurring: boolean;
  onClose: () => void;
}

export default function DebtMemberForm({
  sectionId,
  member,
  isRecurring,
  onClose,
}: DebtMemberFormProps) {
  const { updateDebtMember, recordPayment, recordDebtIncrease, debtSections } = useDebt();
  const [outstandingCash, setOutstandingCash] = useState(member.outstandingCash.toString());
  const [increaseDebt, setIncreaseDebt] = useState(member.increaseDebt?.toString() || '0');
  const [showHistory, setShowHistory] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [currentMember, setCurrentMember] = useState(member);

  // Update local state when member data changes
  useEffect(() => {
    const section = debtSections.find(s => s.id === sectionId);
    const updatedMember = section?.debtMembers.find(m => m.id === member.id);
    if (updatedMember) {
      setCurrentMember(updatedMember);
      setOutstandingCash(updatedMember.outstandingCash.toString());
      if (updatedMember.increaseDebt !== null && updatedMember.increaseDebt !== undefined) {
        setIncreaseDebt(updatedMember.increaseDebt.toString());
      }
    }
  }, [debtSections, sectionId, member.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateDebtMember(member.id, {
        outstandingCash: parseFloat(outstandingCash),
        ...(isRecurring && { increaseDebt: parseFloat(increaseDebt) }),
      });
    } catch (error) {
      console.error('Failed to update debt member:', error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await recordPayment(member.id, amount, paymentNote || undefined);
      setPaymentAmount('');
      setPaymentNote('');
    } catch (error) {
      console.error('Failed to record payment:', error);
    }
  };

  const handleIncreaseDebt = async () => {
    if (!isRecurring || !increaseDebt) return;
    const amount = parseFloat(increaseDebt);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await recordDebtIncrease(member.id, amount, 'Regular debt increase');
    } catch (error) {
      console.error('Failed to increase debt:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Update Debt Amount</h2>
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            View History
          </button>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Outstanding Cash
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">฿</span>
                </div>
                <input
                  type="number"
                  value={outstandingCash}
                  onChange={(e) => setOutstandingCash(e.target.value)}
                  required
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Increase Debt Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">฿</span>
                  </div>
                  <input
                    type="number"
                    value={increaseDebt}
                    onChange={(e) => setIncreaseDebt(e.target.value)}
                    required
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleIncreaseDebt}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Apply Increase
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
              </button>
            </div>
          </form>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Record Payment</h3>
            <form onSubmit={handlePayment} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">฿</span>
                  </div>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., Paid via bank transfer"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showHistory && (
        <PaymentHistory
          history={currentMember.history}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}