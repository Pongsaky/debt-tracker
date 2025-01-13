import { NextResponse } from 'next/server';
import { debtService } from '@/lib/services/debtService';
import { CreateDebtSectionInput } from '@/lib/types';

export async function GET() {
  try {
    const debtSections = await debtService.getAllDebtSections();
    return NextResponse.json(debtSections);
  } catch (error) {
    console.error('Error fetching debt sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debt sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateDebtSectionInput = await request.json();
    const debtSection = await debtService.createDebtSection(body);
    return NextResponse.json(debtSection);
  } catch (error) {
    console.error('Error creating debt section:', error);
    return NextResponse.json(
      { error: 'Failed to create debt section' },
      { status: 500 }
    );
  }
}