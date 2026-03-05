import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Allow the login page without any restriction
    if (request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next();
    }
    // Dashboard auth is enforced client-side via Supabase session check.
    // Server-side Supabase SSR check can be added once credentials are configured.
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
