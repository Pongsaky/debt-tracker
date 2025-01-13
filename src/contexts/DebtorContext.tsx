"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Debtor, CreateDebtorInput } from '@/lib/types';

interface DebtorContextType {
  debtors: Debtor[];
  isLoading: boolean;
  error: string | null;
  addDebtor: (data: CreateDebtorInput) => Promise<void>;
  updateDebtor: (id: string, data: Partial<CreateDebtorInput>) => Promise<void>;
  deleteDebtor: (id: string) => Promise<void>;
  getDebtorById: (id: string) => Debtor | undefined;
  getDebtorByEnglishName: (englishName: string) => Debtor | undefined;
  refreshDebtors: () => Promise<void>;
}

const DebtorContext = createContext<DebtorContextType | undefined>(undefined);

export function DebtorProvider({ children }: { children: ReactNode }) {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebtors = async () => {
    try {
      const response = await fetch('/api/debtors');
      if (!response.ok) throw new Error('Failed to fetch debtors');
      const data = await response.json();
      setDebtors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, []);

  const addDebtor = async (data: CreateDebtorInput) => {
    try {
      const response = await fetch('/api/debtors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create debtor');
      await fetchDebtors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create debtor');
      throw err;
    }
  };

  const updateDebtor = async (id: string, data: Partial<CreateDebtorInput>) => {
    try {
      const response = await fetch(`/api/debtors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update debtor');
      await fetchDebtors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update debtor');
      throw err;
    }
  };

  const deleteDebtor = async (id: string) => {
    try {
      const response = await fetch(`/api/debtors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete debtor');
      await fetchDebtors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete debtor');
      throw err;
    }
  };

  const getDebtorById = (id: string) => {
    return debtors.find(debtor => debtor.id === id);
  };

  const getDebtorByEnglishName = (englishName: string) => {
    return debtors.find(debtor => debtor.englishName === englishName);
  };

  const refreshDebtors = fetchDebtors;

  const value = {
    debtors,
    isLoading,
    error,
    addDebtor,
    updateDebtor,
    deleteDebtor,
    getDebtorById,
    getDebtorByEnglishName,
    refreshDebtors,
  };

  return <DebtorContext.Provider value={value}>{children}</DebtorContext.Provider>;
}

export function useDebtor() {
  const context = useContext(DebtorContext);
  if (context === undefined) {
    throw new Error('useDebtor must be used within a DebtorProvider');
  }
  return context;
}