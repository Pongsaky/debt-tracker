import prisma from '../prisma';
import { CreateDebtSectionInput, UpdateDebtMemberInput, CreateHistoryInput } from '../types';
import { Prisma } from '@prisma/client';

const debtSectionInclude = {
  debtMembers: {
    include: {
      debtor: true,
      history: true,
    },
  },
};

export const debtService = {
  // Debt Section Operations
  getAllDebtSections: async () => {
    return prisma.debtSection.findMany({
      include: debtSectionInclude,
      orderBy: { createdDate: 'desc' },
    });
  },

  getDebtSectionById: async (id: string) => {
    return prisma.debtSection.findUnique({
      where: { id },
      include: debtSectionInclude,
    });
  },

  createDebtSection: async (data: CreateDebtSectionInput) => {
    return prisma.debtSection.create({
      data: {
        name: data.name,
        category: data.category,
        status: 'InProgress',
        debtMembers: {
          create: data.members.map(member => ({
            debtorId: member.debtorId,
            outstandingCash: member.outstandingCash,
            increaseDebt: member.increaseDebt,
            history: member.outstandingCash > 0
              ? {
                  create: {
                    amount: member.outstandingCash,
                    type: 'increase',
                    note: 'Initial debt',
                  },
                }
              : undefined,
          })),
        },
      },
      include: debtSectionInclude,
    });
  },

  completeDebtSection: async (id: string) => {
    const now = new Date();
    const debtSection = await prisma.debtSection.findUnique({
      where: { id },
      select: { createdDate: true },
    });

    if (!debtSection) throw new Error('Debt section not found');

    const diffTime = Math.abs(now.getTime() - debtSection.createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return prisma.debtSection.update({
      where: { id },
      data: {
        status: 'Completed',
        endDate: now,
        duration: `${diffDays} days`,
      },
      include: debtSectionInclude,
    });
  },

  deleteDebtSection: async (id: string) => {
    return prisma.debtSection.delete({
      where: { id },
    });
  },

  // Debt Member Operations
  updateDebtMember: async (id: string, data: UpdateDebtMemberInput) => {
    return prisma.debtMember.update({
      where: { id },
      data,
      include: {
        debtor: true,
        history: true,
      },
    });
  },

  // History Operations
  createHistory: async (data: CreateHistoryInput) => {
    const history = await prisma.history.create({
      data: {
        debtMemberId: data.debtMemberId,
        amount: data.amount,
        type: data.type,
        note: data.note,
      },
    });

    // Update debt member's outstanding cash and paid status
    const debtMember = await prisma.debtMember.findUnique({
      where: { id: data.debtMemberId },
    });

    if (debtMember) {
      const newOutstandingCash = data.type === 'payment'
        ? debtMember.outstandingCash - data.amount
        : debtMember.outstandingCash + data.amount;

      await prisma.debtMember.update({
        where: { id: data.debtMemberId },
        data: {
          outstandingCash: newOutstandingCash,
          hasPaid: newOutstandingCash <= 0,
        },
      });
    }

    return history;
  },

  getHistoryByDebtMemberId: async (debtMemberId: string) => {
    return prisma.history.findMany({
      where: { debtMemberId },
      orderBy: { date: 'desc' },
    });
  },
};