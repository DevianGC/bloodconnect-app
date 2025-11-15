import { NextResponse } from 'next/server';
import { adminLogin, donorLogin } from '../../../../lib/api';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};
    let result;
    if (role === 'admin') {
      result = await adminLogin(email, password);
    } else {
      result = await donorLogin(email, password);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}