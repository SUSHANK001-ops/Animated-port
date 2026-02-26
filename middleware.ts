import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Convert your secret to a format the Edge Runtime understands
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function middleware(request: NextRequest) {
  // 1. Get the cookie you set in your login route
  const token = request.cookies.get('adminToken')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define the areas you want to protect
  const isAdminArea = pathname.startsWith('/adminDashboard') || 
                      pathname.startsWith('/api/blog') ||
                      pathname.startsWith('/registerAdmin'); // Protect your blog updates

  if (isAdminArea) {
    // If there is no token at all, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 3. Verify the token signature and expiration
      const { payload } = await jwtVerify(token, SECRET);

      // 4. Check if the role is 'admin' 
      // Note: Ensure you added 'role: "admin"' to your login payload!
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // If valid admin, let them through
      return NextResponse.next();
    } catch (error) {
      // If token is invalid or expired, redirect to login
      console.error("Auth Error:", error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For all other routes, let the user pass
  return NextResponse.next();
}

// 5. Tell Next.js which routes to run this proxy on
export const config = {
  matcher: [
    '/adminDashboard/:path*',
    '/register-admin/:path*',
    '/api/protected-blog/:path*'
  ],
};