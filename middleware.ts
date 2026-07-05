import { auth } from "@/auth";
import { NextResponse } from "next/server";

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
    // The prompt says "Only Admin can access dashboard" for general access, but under
    // roles it lists: Admin, Editor, Staff. We will allow all three but enforce page level permissions if needed.
    const userRole = req.auth?.user?.role;
    if (!userRole || (userRole !== "ADMIN" && userRole !== "EDITOR" && userRole !== "STAFF")) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

// Matches all paths except Next.js internals, static files, and icons
export const config = {
  matcher: ["/((?!api/public|_next/static|_next/image|images|uploads|favicon.ico|robots.txt|sitemap.xml).*)"],
};
