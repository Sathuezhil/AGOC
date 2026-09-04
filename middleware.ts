import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { getLocaleFromPathname, stripLocale } from "@/lib/i18n/path";

function withLocaleHeaders(
  request: NextRequest,
  pathname: string,
  locale: Locale,
) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-pathname-base", stripLocale(pathname));
  requestHeaders.set("x-locale", locale);
  return requestHeaders;
}

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);
  const basePath = stripLocale(pathname);
  const isAdminRoute =
    basePath.startsWith("/admin") || pathname.startsWith("/api/admin");

  // API routes: check auth only — never rewrite the request body (fixes PDF/image uploads).
  if (pathname.startsWith("/api/")) {
    if (!isAdminRoute) {
      return NextResponse.next();
    }

    const session = await verifySessionToken(
      request.cookies.get(SESSION_COOKIE)?.value,
    );

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    return NextResponse.next();
  }

  const requestHeaders = withLocaleHeaders(request, pathname, locale);

  // Arabic public URLs: /ar/... → rewrite to unprefixed pages.
  let response: NextResponse;
  if (locale === "ar" && !basePath.startsWith("/admin") && basePath !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = basePath;
    response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  } else {
    response = NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  setLocaleCookie(response, locale);

  if (!isAdminRoute && basePath !== "/login") {
    return response;
  }

  // Admin auth uses the base path (without /ar).
  if (basePath.startsWith("/admin") || pathname.startsWith("/admin")) {
    const session = await verifySessionToken(
      request.cookies.get(SESSION_COOKIE)?.value,
    );

    if (!session) {
      const login = new URL("/login", request.url);
      login.searchParams.set("from", basePath.startsWith("/admin") ? basePath : pathname);
      return NextResponse.redirect(login);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|logo.png|icon|api/media|api/admin/upload|api/admin/settings/profile-pdf|api/careers/apply|documents/).*)",
  ],
};
