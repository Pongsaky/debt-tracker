import { NextResponse } from 'next/server';
import { debtorService } from '@/lib/services/debtorService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const debtor = await debtorService.getDebtorById(params.id);
    if (!debtor) {
      return NextResponse.json(
        { error: 'Debtor not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(debtor);
  } catch (error) {
    console.error('Error fetching debtor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debtor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const debtor = await debtorService.updateDebtor(params.id, body);
    return NextResponse.json(debtor);
  } catch (error) {
    console.error('Error updating debtor:', error);
    return NextResponse.json(
      { error: 'Failed to update debtor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await debtorService.deleteDebtor(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting debtor:', error);
    return NextResponse.json(
      { error: 'Failed to delete debtor' },
      { status: 500 }
    );
  }
}