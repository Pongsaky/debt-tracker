import { DebtSection, Debtor, DebtSectionWithMembers } from '../interfaces/types';

export const mockDebtors: Debtor[] = [
  { id: '1', englishName: 'John Doe', thaiName: 'จอห์น โด' },
  { id: '2', englishName: 'Jane Smith', thaiName: 'เจน สมิธ' },
  { id: '3', englishName: 'Bob Wilson', thaiName: 'บ็อบ วิลสัน' },
];

export const mockDebtSections: DebtSectionWithMembers[] = [
  {
    id: '1',
    name: 'Spotify CU',
    category: 'Monthly',
    members: ['1', '2'],
    status: 'In Progress',
    createdDate: '2025-01-01',
    endDate: null,
    duration: null,
    debtMembers: [
      {
        debtorId: '1',
        outstandingCash: 89,
        increaseDebt: 89,
        hasPaid: false,
        history: []
      },
      {
        debtorId: '2',
        outstandingCash: 89,
        increaseDebt: 89,
        hasPaid: false,
        history: []
      },
    ],
  },
  {
    id: '2',
    name: 'Lunch Payment',
    category: 'One-time',
    members: ['2', '3'],
    status: 'Completed',
    createdDate: '2025-01-10',
    endDate: '2025-01-10',
    duration: '0 days',
    debtMembers: [
      {
        debtorId: '2',
        outstandingCash: 0,
        hasPaid: true,
        history: []
      },
      {
        debtorId: '3',
        outstandingCash: 150,
        hasPaid: false,
        history: []
      },
    ],
  },
];