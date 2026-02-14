import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/lib/auth';
import type { AdminAuthRequest, AdminAuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: AdminAuthRequest = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' } as AdminAuthResponse,
        { status: 400 }
      );
    }

    const isValid = await validateAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' } as AdminAuthResponse,
        { status: 401 }
      );
    }

    const token = generateAdminToken();

    return NextResponse.json({
      success: true,
      token,
    } as AdminAuthResponse);

  } catch (error: any) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' } as AdminAuthResponse,
      { status: 500 }
    );
  }
}
