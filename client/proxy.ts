import { NextResponse, type NextRequest } from "next/server";

const ONBOARDED_COOKIE = "potzi_onboarded";

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => (
    cookie.name.startsWith("sb-") && cookie.name.includes("auth-token")
  ));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith("/profile") || pathname.startsWith("/pool");
  const isAuthPage = pathname.startsWith("/login");
  const isOnboardingPage = pathname.startsWith("/onboarding");
  const hasAuthCookie = hasSupabaseAuthCookie(request);
  const hasOnboardedCookie = request.cookies.get(ONBOARDED_COOKIE)?.value === "1";

  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("error", "Please sign in to continue");
    return NextResponse.redirect(loginUrl);
  }

  if (isOnboardingPage && !hasAuthCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("error", "Please sign in to continue");
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedRoute && hasAuthCookie && !hasOnboardedCookie) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = "/onboarding";
    onboardingUrl.search = "";
    return NextResponse.redirect(onboardingUrl);
  }

  if (isAuthPage && hasAuthCookie) {
    const profileUrl = request.nextUrl.clone();
    profileUrl.pathname = "/profile";
    profileUrl.search = "";
    return NextResponse.redirect(profileUrl);
  }

  if (isOnboardingPage && hasOnboardedCookie) {
    const profileUrl = request.nextUrl.clone();
    profileUrl.pathname = "/profile";
    profileUrl.search = "";
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/profile/:path*", "/pool", "/login", "/onboarding"],
};
