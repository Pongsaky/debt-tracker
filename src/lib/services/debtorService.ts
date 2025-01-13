import prisma from '../prisma';
import { CreateDebtorInput } from '../types';

const debtorInclude = {
  debtMembers: {
    include: {
      debtSection: true,
      history: true,
    },
  },
};

export const debtorService = {
  getAllDebtors: async () => {
    return prisma.debtor.findMany({
      include: debtorInclude,
      orderBy: { englishName: 'asc' },
    });
  },

  getDebtorById: async (id: string) => {
    return prisma.debtor.findUnique({
      where: { id },
      include: debtorInclude,
    });
  },

  getDebtorByEnglishName: async (englishName: string) => {
    return prisma.debtor.findUnique({
      where: { englishName },
      include: debtorInclude,
    });
  },

  createDebtor: async (data: CreateDebtorInput) => {
    return prisma.debtor.create({
      data: {
        englishName: data.englishName,
        thaiName: data.thaiName,
      },
      include: debtorInclude,
    });
  },

  updateDebtor: async (id: string, data: Partial<CreateDebtorInput>) => {
    return prisma.debtor.update({
      where: { id },
      data,
      include: debtorInclude,
    });
  },

  deleteDebtor: async (id: string) => {
    // First check if debtor has any active debts
    const debtor = await prisma.debtor.findUnique({
      where: { id },
      include: {
        debtMembers: {
          where: {
            debtSection: {
              status: 'InProgress',
            },
          },
        },
      },
    });

    if (debtor?.debtMembers.length ?? 0 > 0) {
      throw new Error('Cannot delete debtor with active debts');
    }

    return prisma.debtor.delete({
      where: { id },
    });
  },

  // Get all active debts for a debtor
  getActiveDebts: async (debtorId: string) => {
    return prisma.debtMember.findMany({
      where: {
        debtorId,
        debtSection: {
          status: 'InProgress',
        },
      },
      include: {
        debtSection: true,
        history: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get debt history for a debtor
  getDebtHistory: async (debtorId: string) => {
    return prisma.debtMember.findMany({
      where: {
        debtorId,
        debtSection: {
          status: 'Completed',
        },
      },
      include: {
        debtSection: true,
        history: true,
      },
      orderBy: {
        debtSection: {
          endDate: 'desc',
        },
      },
    });
  },

  // Search debtors by name
  searchDebtors: async (searchTerm: string) => {
    return prisma.debtor.findMany({
      where: {
        OR: [
          {
            englishName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            thaiName: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: debtorInclude,
    });
  },
};