import { NextResponse } from 'next/server';
import { debtService } from '@/lib/services/debtService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const debtSection = await debtService.getDebtSectionById(params.id);
    if (!debtSection) {
      return NextResponse.json(
        { error: 'Debt section not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(debtSection);
  } catch (error) {
    console.error('Error fetching debt section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debt section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await debtService.deleteDebtSection(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting debt section:', error);
    return NextResponse.json(
      { error: 'Failed to delete debt section' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const debtSection = await debtService.completeDebtSection(params.id);
    return NextResponse.json(debtSection);
  } catch (error) {
    console.error('Error completing debt section:', error);
    return NextResponse.json(
      { error: 'Failed to complete debt section' },
      { status: 500 }
    );
  }
}