import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/admin/login";

  // Allow API authentication routes directly
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Handle Admin routes protection
  if (isAdminRoute) {
    if (isLoginRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return NextResponse.redirect(
        new URL(`/admin/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }

    // Role-based verification: Only ADMIN, EDITOR, and STAFF can access the dashboard.
    const userRole = req.auth?.user?.role;
    if (!userRole || (userRole !== "ADMIN" && userRole !== "EDITOR" && userRole !== "STAFF")) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

// Matches only admin routes to minimize edge function execution footprint and bundle size.
export const config = {
  matcher: ["/admin/:path*"],
};
