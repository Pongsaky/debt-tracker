'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebt } from '@/contexts/DebtContext';
import { useDebtor } from '@/contexts/DebtorContext';
import { Debtor, DebtCategory, CreateDebtSectionInput } from '@/lib/types';

interface SelectedDebtorWithAmount extends Debtor {
  outstandingCash: number;
  increaseDebt?: number;
}

export default function AddDebtSection() {
  const { addDebtSection } = useDebt();
  const { debtors, addDebtor } = useDebtor();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DebtCategory>('Monthly');
  const [selectedDebtors, setSelectedDebtors] = useState<SelectedDebtorWithAmount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newDebtorEnglishName, setNewDebtorEnglishName] = useState('');
  const [newDebtorThaiName, setNewDebtorThaiName] = useState('');
  const [showNewDebtorForm, setShowNewDebtorForm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDebtors = debtors.filter(
    (debtor) =>
      !selectedDebtors.some((selected) => selected.id === debtor.id) &&
      (debtor.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debtor.thaiName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNewDebtor = () => {
    if (!newDebtorEnglishName || !newDebtorThaiName) return;

    const newDebtor: Omit<Debtor, 'id' | 'createdAt' | 'updatedAt'> = {
      englishName: newDebtorEnglishName,
      thaiName: newDebtorThaiName,
    };

    addDebtor(newDebtor);
    setNewDebtorEnglishName('');
    setNewDebtorThaiName('');
    setShowNewDebtorForm(false);
    setSearchTerm('');
  };

  const handleAddDebtor = (debtor: Debtor) => {
    const newDebtor: SelectedDebtorWithAmount = {
      ...debtor,
      outstandingCash: 0,
      ...(category !== 'OneTime' && { increaseDebt: 0 }),
    };
    setSelectedDebtors([...selectedDebtors, newDebtor]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleUpdateDebtorAmount = (
    debtorId: string,
    field: 'outstandingCash' | 'increaseDebt',
    value: number
  ) => {
    setSelectedDebtors(
      selectedDebtors.map((d) =>
        d.id === debtorId
          ? {
              ...d,
              [field]: value,
            }
          : d
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sectionData: CreateDebtSectionInput = {
      name,
      category,
      members: selectedDebtors.map(debtor => ({
        debtorId: debtor.id,
        outstandingCash: debtor.outstandingCash,
        increaseDebt: debtor.increaseDebt,
      })),
    };

    addDebtSection(sectionData);

    // Reset form
    setName('');
    setCategory('Monthly');
    setSelectedDebtors([]);
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add New Debt Section
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Add New Debt Section</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DebtCategory)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="EveryXDays">Every X Days</option>
                  <option value="OneTime">One Time</option>
                </select>
              </div>

              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Members
                </label>
                <div className="mt-1">
                  {/* Selected Members with Amounts */}
                  <div className="mb-4 space-y-3">
                    {selectedDebtors.map((debtor) => (
                      <div
                        key={debtor.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {debtor.englishName}
                          </p>
                          <p className="text-xs text-gray-500">{debtor.thaiName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div>
                            <label className="block text-xs text-gray-500">
                              Outstanding
                            </label>
                            <input
                              type="number"
                              value={debtor.outstandingCash}
                              onChange={(e) =>
                                handleUpdateDebtorAmount(
                                  debtor.id,
                                  'outstandingCash',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 text-sm rounded-md border-gray-300"
                            />
                          </div>
                          {category !== 'OneTime' && (
                            <div>
                              <label className="block text-xs text-gray-500">
                                Increase
                              </label>
                              <input
                                type="number"
                                value={debtor.increaseDebt}
                                onChange={(e) =>
                                  handleUpdateDebtorAmount(
                                    debtor.id,
                                    'increaseDebt',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-24 text-sm rounded-md border-gray-300"
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDebtors(
                                selectedDebtors.filter((d) => d.id !== debtor.id)
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <span className="sr-only">Remove</span>
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Member Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search members..."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {isDropdownOpen && (searchTerm || filteredDebtors.length > 0) && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                        {filteredDebtors.map((debtor) => (
                          <button
                            key={debtor.id}
                            type="button"
                            onClick={() => handleAddDebtor(debtor)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {debtor.englishName} ({debtor.thaiName})
                          </button>
                        ))}
                        {!showNewDebtorForm && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewDebtorForm(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-indigo-600 hover:bg-gray-100"
                          >
                            + Add new member
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {showNewDebtorForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Add New Member
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        English Name
                      </label>
                      <input
                        type="text"
                        value={newDebtorEnglishName}
                        onChange={(e) => setNewDebtorEnglishName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thai Name
                      </label>
                      <input
                        type="text"
                        value={newDebtorThaiName}
                        onChange={(e) => setNewDebtorThaiName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewDebtorForm(false);
                          setNewDebtorEnglishName('');
                          setNewDebtorThaiName('');
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewDebtor}
                        className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        Add Member
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}