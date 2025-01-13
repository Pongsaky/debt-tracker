'use client';

import { useState } from 'react';
import { useDebt } from '@/contexts/DebtContext';
import { useDebtor } from '@/contexts/DebtorContext';
import AddDebtSection from '@/components/AddDebtSection';
import AddDebtor from '@/components/AddDebtor';
import DebtMemberForm from '@/components/DebtMemberForm';
import PaymentHistory from '@/components/PaymentHistory';
import { DebtMember } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'debts' | 'debtors'>('debts');
  const { debtSections, isLoading, error, completeDebtSection, deleteDebtSection } = useDebt();
  const { debtors } = useDebtor();
  const [selectedMember, setSelectedMember] = useState<{
    sectionId: string;
    member: DebtMember;
    isRecurring: boolean;
  } | null>(null);
  const [viewingHistory, setViewingHistory] = useState<{
    member: DebtMember;
  } | null>(null);

  const generateAnnouncement = (sectionId: string) => {
    const section = debtSections.find((s) => s.id === sectionId);
    if (!section) return;

    const memberDetails = section.debtMembers
      .map((member) => {
        const debtor = debtors.find((d) => d.id === member.debtorId);
        return `${debtor?.englishName}: ฿${member.outstandingCash}${member.hasPaid ? ' (Paid)' : ''}`;
      })
      .join('\n');

    const announcement = `${section.name}\n${memberDetails}`;
    navigator.clipboard.writeText(announcement);
    alert('Announcement copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('debts')}
            className={`${
              activeTab === 'debts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Debt Sections
          </button>
          <button
            onClick={() => setActiveTab('debtors')}
            className={`${
              activeTab === 'debtors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Debtors
          </button>
        </nav>
      </div>

      {/* Add buttons */}
      <div>
        {activeTab === 'debts' ? <AddDebtSection /> : <AddDebtor />}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'debts' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {debtSections.map((section) => (
              <div
                key={section.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {section.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        section.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {section.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Category: {section.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(section.createdDate).toLocaleDateString()}
                    </p>
                    {section.endDate && (
                      <p className="text-sm text-gray-500">
                        Duration: {section.duration}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Members:</h4>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {section.debtMembers.map((member) => {
                        const debtor = debtors.find(
                          (d) => d.id === member.debtorId
                        );
                        return (
                          <li
                            key={member.id}
                            className="py-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  {debtor?.englishName}
                                </span>
                                {member.hasPaid && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Paid
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  ฿{member.outstandingCash}
                                </span>
                                <button
                                  onClick={() => setViewingHistory({ member })}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {member.increaseDebt && (
                              <div className="text-xs text-gray-500 mt-1">
                                Increase: ฿{member.increaseDebt}
                              </div>
                            )}
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() =>
                                  setSelectedMember({
                                    sectionId: section.id,
                                    member,
                                    isRecurring: section.category !== 'OneTime',
                                  })
                                }
                                className="text-sm text-indigo-600 hover:text-indigo-900"
                              >
                                Update
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => generateAnnouncement(section.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Copy Announcement
                    </button>
                    {section.status === 'InProgress' ? (
                      <button
                        onClick={() => completeDebtSection(section.id)}
                        className="text-sm text-green-600 hover:text-green-900"
                      >
                        Mark as Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteDebtSection(section.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Delete Section
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {debtors.map((debtor) => (
              <div
                key={debtor.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {debtor.englishName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{debtor.thaiName}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Active Debts:
                    </h4>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {debtSections
                        .filter(
                          (section) =>
                            section.status === 'InProgress' &&
                            section.debtMembers.some(
                              (member) => member.debtorId === debtor.id
                            )
                        )
                        .map((section) => {
                          const memberDebt = section.debtMembers.find(
                            (member) => member.debtorId === debtor.id
                          );
                          return (
                            <li key={section.id} className="py-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">
                                    {section.name}
                                  </span>
                                  {memberDebt?.hasPaid && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      Paid
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  ฿{memberDebt?.outstandingCash}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMember && (
        <DebtMemberForm
          sectionId={selectedMember.sectionId}
          member={selectedMember.member}
          isRecurring={selectedMember.isRecurring}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {viewingHistory && (
        <PaymentHistory
          history={viewingHistory.member.history}
          onClose={() => setViewingHistory(null)}
        />
      )}
    </div>
  );
}
