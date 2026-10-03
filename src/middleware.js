import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create an authenticated Supabase client
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Get the user from the session
  // getUser() is safer than getSession() as it validates the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Supabase refreshes tokens indefinitely, so cap how long one sign-in stays
  // valid. last_sign_in_at comes from the auth server and cannot be forged client
  // side. Enforced here rather than only in the UI so the limit is real.
  const MAX_SESSION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
  const signedInAt = user?.last_sign_in_at ? Date.parse(user.last_sign_in_at) : NaN;
  const sessionExpired =
    Boolean(user) && !Number.isNaN(signedInAt) && Date.now() - signedInAt > MAX_SESSION_MS;

  // Old admin path from the original template.
  if (request.nextUrl.pathname === "/mfiadmin" || request.nextUrl.pathname.startsWith("/mfiadmin/")) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace(/^\/mfiadmin/, "/mdtadmin");
    return NextResponse.redirect(url);
  }

  // Protect /mdtadmin routes
  if (request.nextUrl.pathname.startsWith("/mdtadmin") && !request.nextUrl.pathname.startsWith("/mdtadmin/login")) {
    if (!user || sessionExpired) {
      const loginUrl = new URL("/mdtadmin/login", request.url);
      if (sessionExpired) loginUrl.searchParams.set("expired", "1");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect /login to /mdtadmin/login
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/mdtadmin/login", request.url));
  }

  // If at login page and user is logged in, redirect to dashboard — unless the
  // session has aged out, in which case they need to sign in again.
  if (request.nextUrl.pathname === "/mdtadmin/login") {
    if (user && !sessionExpired) {
      return NextResponse.redirect(new URL("/mdtadmin", request.url));
    }
  }

  // Redirect legacy /admin to /mdtadmin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/mdtadmin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
