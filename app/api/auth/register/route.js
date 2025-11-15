import { NextResponse } from 'next/server';
import { donorRegister } from '../../../../lib/api';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await donorRegister(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}