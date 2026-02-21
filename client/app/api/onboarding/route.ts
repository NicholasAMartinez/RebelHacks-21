import { NextResponse } from "next/server";
import { ONBOARDED_COOKIE, getOnboardedState } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = userData.user;

  const { error } = await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);

  if (error) {
    console.error("[onboarding] failed to update profile", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ONBOARDED_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export async function GET() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    return NextResponse.json({ onboarded: false }, { status: 401 });
  }

  const result = await getOnboardedState(supabase, userData.user.id);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, onboarded: result.onboarded });
  if (result.onboarded) {
    response.cookies.set(ONBOARDED_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  } else {
    response.cookies.delete(ONBOARDED_COOKIE);
  }
  return response;
}
