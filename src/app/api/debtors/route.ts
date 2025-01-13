import { NextResponse } from 'next/server';
import { debtorService } from '@/lib/services/debtorService';
import { CreateDebtorInput } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const debtors = search
      ? await debtorService.searchDebtors(search)
      : await debtorService.getAllDebtors();

    return NextResponse.json(debtors);
  } catch (error) {
    console.error('Error fetching debtors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debtors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateDebtorInput = await request.json();
    const debtor = await debtorService.createDebtor(body);
    return NextResponse.json(debtor);
  } catch (error) {
    console.error('Error creating debtor:', error);
    return NextResponse.json(
      { error: 'Failed to create debtor' },
      { status: 500 }
    );
  }
}