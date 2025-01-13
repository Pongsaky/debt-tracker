import { NextResponse } from 'next/server';
import { debtService } from '@/lib/services/debtService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const history = await debtService.getHistoryByDebtMemberId(params.id);
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}