import { Prisma } from '@prisma/client';

export type DebtCategory = 'Monthly' | 'Daily' | 'Weekly' | 'EveryXDays' | 'OneTime';
export type DebtStatus = 'Completed' | 'InProgress';
export type HistoryType = 'increase' | 'payment';

export interface DebtHistory {
  id: string;
  date: Date;
  amount: number;
  type: HistoryType;
  note?: string | null;
  debtMemberId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtMember {
  id: string;
  debtorId: string;
  debtSectionId: string;
  outstandingCash: number;
  increaseDebt?: number | null;
  hasPaid: boolean;
  history: DebtHistory[];
  createdAt: Date;
  updatedAt: Date;
  debtor?: Debtor;
}

export interface Debtor {
  id: string;
  englishName: string;
  thaiName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtSection {
  id: string;
  name: string;
  category: DebtCategory;
  status: DebtStatus;
  createdDate: Date;
  endDate: Date | null;
  duration: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtSectionWithMembers extends DebtSection {
  debtMembers: DebtMember[];
}

export interface CreateDebtSectionInput {
  name: string;
  category: DebtCategory;
  members: {
    debtorId: string;
    outstandingCash: number;
    increaseDebt?: number;
  }[];
}

export interface CreateDebtorInput {
  englishName: string;
  thaiName: string;
}

export interface UpdateDebtMemberInput {
  outstandingCash?: number;
  increaseDebt?: number | null;
  hasPaid?: boolean;
}

export interface CreateHistoryInput {
  debtMemberId: string;
  amount: number;
  type: HistoryType;
  note?: string;
}

// Helper type for Prisma includes
export type DebtSectionInclude = Prisma.DebtSectionInclude;
export type DebtMemberInclude = Prisma.DebtMemberInclude;
export type DebtorInclude = Prisma.DebtorInclude;