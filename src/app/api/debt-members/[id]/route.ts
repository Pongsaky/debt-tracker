import { NextResponse } from 'next/server';
import { debtService } from '@/lib/services/debtService';
import { UpdateDebtMemberInput, CreateHistoryInput } from '@/lib/types';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateDebtMemberInput = await request.json();
    const debtMember = await debtService.updateDebtMember(params.id, body);
    return NextResponse.json(debtMember);
  } catch (error) {
    console.error('Error updating debt member:', error);
    return NextResponse.json(
      { error: 'Failed to update debt member' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: CreateHistoryInput = await request.json();
    const history = await debtService.createHistory({
      ...body,
      debtMemberId: params.id,
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error creating history:', error);
    return NextResponse.json(
      { error: 'Failed to create history' },
      { status: 500 }
    );
  }
}