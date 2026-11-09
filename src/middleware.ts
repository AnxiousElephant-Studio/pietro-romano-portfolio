import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/core/i18n/config";
import { detectLocale } from "@/core/i18n/detectLocale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(redirectUrl);
  response.headers.set("Vary", "Cookie, Accept-Language, x-vercel-ip-country");

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
