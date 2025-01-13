"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DebtSectionWithMembers, DebtMember, CreateDebtSectionInput, CreateHistoryInput } from '../lib/types';

interface DebtContextType {
  debtSections: DebtSectionWithMembers[];
  isLoading: boolean;
  error: string | null;
  addDebtSection: (debtSection: CreateDebtSectionInput) => Promise<void>;
  updateDebtMember: (id: string, data: Partial<DebtMember>) => Promise<void>;
  deleteDebtSection: (id: string) => Promise<void>;
  completeDebtSection: (id: string) => Promise<void>;
  recordPayment: (memberId: string, amount: number, note?: string) => Promise<void>;
  recordDebtIncrease: (memberId: string, amount: number, note?: string) => Promise<void>;
  refreshDebtSections: () => Promise<void>;
}

const DebtContext = createContext<DebtContextType | undefined>(undefined);

export function DebtProvider({ children }: { children: ReactNode }) {
  const [debtSections, setDebtSections] = useState<DebtSectionWithMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebtSections = async () => {
    try {
      const response = await fetch('/api/debt-sections');
      if (!response.ok) throw new Error('Failed to fetch debt sections');
      const data = await response.json();
      setDebtSections(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtSections();
  }, []);

  const addDebtSection = async (data: CreateDebtSectionInput) => {
    try {
      const response = await fetch('/api/debt-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create debt section');
      await fetchDebtSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create debt section');
      throw err;
    }
  };

  const updateDebtMember = async (id: string, data: Partial<DebtMember>) => {
    try {
      const response = await fetch(`/api/debt-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update debt member');
      await fetchDebtSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update debt member');
      throw err;
    }
  };

  const deleteDebtSection = async (id: string) => {
    try {
      const response = await fetch(`/api/debt-sections/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete debt section');
      await fetchDebtSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete debt section');
      throw err;
    }
  };

  const completeDebtSection = async (id: string) => {
    try {
      const response = await fetch(`/api/debt-sections/${id}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to complete debt section');
      await fetchDebtSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete debt section');
      throw err;
    }
  };

  const recordPayment = async (memberId: string, amount: number, note?: string) => {
    try {
      const historyData: CreateHistoryInput = {
        debtMemberId: memberId,
        amount,
        type: 'payment',
        note,
      };
      const response = await fetch(`/api/debt-members/${memberId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData),
      });
      if (!response.ok) throw new Error('Failed to record payment');
      await fetchDebtSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
      throw err;
    }
  };

  const recordDebtIncrease = async (memberId: string, amount: number, note?: string) => {
    try {
      const historyData: CreateHistoryInput = {
        debtMemberId: memberId,
        amount,
        type: 'increase',
        note,
      };
      const response = await fetch(`/api/debt-members/${memberId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData),
      });
      if (!response.ok) throw new Error('Failed to record debt increase');
      await fetchDebtSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record debt increase');
      throw err;
    }
  };

  const refreshDebtSections = fetchDebtSections;

  const value = {
    debtSections,
    isLoading,
    error,
    addDebtSection,
    updateDebtMember,
    deleteDebtSection,
    completeDebtSection,
    recordPayment,
    recordDebtIncrease,
    refreshDebtSections,
  };

  return <DebtContext.Provider value={value}>{children}</DebtContext.Provider>;
}

export function useDebt() {
  const context = useContext(DebtContext);
  if (context === undefined) {
    throw new Error('useDebt must be used within a DebtProvider');
  }
  return context;
}