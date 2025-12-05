import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * On-demand Revalidation API Route
 * 
 * Triggers cache invalidation for ISR pages
 * 
 * Usage:
 * POST /api/revalidate?tag=donors
 * POST /api/revalidate?path=/admin/dashboard
 * 
 * Security: Should be protected with a secret token in production
 */
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag');
  const path = searchParams.get('path');
  const secret = searchParams.get('secret');
  
  // Validate secret token in production
  if (process.env.NODE_ENV === 'production') {
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid revalidation token' },
        { status: 401 }
      );
    }
  }
  
  try {
    if (tag) {
      // Revalidate by cache tag
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        value: tag,
        timestamp: Date.now(),
      });
    }
    
    if (path) {
      // Revalidate by path
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        value: path,
        timestamp: Date.now(),
      });
    }
    
    return NextResponse.json(
      { error: 'Missing tag or path parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Revalidation endpoint',
    usage: {
      byTag: 'POST /api/revalidate?tag=donors',
      byPath: 'POST /api/revalidate?path=/admin/dashboard',
    },
    availableTags: [
      'donors',
      'requests',
      'analytics',
      'alerts',
      'user',
      'appointments',
    ],
  });
}
