import { NextResponse } from "next/server";
import { ONBOARDED_COOKIE } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";

function normalizeDisplayName(input: string) {
  const base = input.trim().slice(0, 64);
  const withoutAt = base.replace(/@/g, " ");
  return withoutAt.replace(/[^a-zA-Z0-9 _.-]/g, "").trim();
}

export async function POST() {
  const demoEmail = (process.env.DEMO_USER_EMAIL || "").trim();
  const demoPassword = process.env.DEMO_USER_PASSWORD || "";
  const allowAutoCreate = process.env.DEMO_AUTO_REGISTER === "1";

  if (!demoEmail || !demoPassword) {
    return NextResponse.json(
      { ok: false, error: "Demo mode is not configured on this deployment." },
      { status: 503 },
    );
  }

  const supabase = await createClient();

  let signIn = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  if (signIn.error && allowAutoCreate) {
    const rawName = demoEmail.split("@")[0] || "Judge Demo";
    const demoName = normalizeDisplayName(rawName) || "Judge Demo";
    await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
      options: {
        data: {
          name: demoName,
          username: demoName,
        },
      },
    });

    signIn = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });
  }

  if (signIn.error || !signIn.data.user) {
    return NextResponse.json({ ok: false, error: "Demo login failed." }, { status: 401 });
  }

  const user = signIn.data.user;
  const fallbackName = normalizeDisplayName(user.user_metadata?.name || user.email?.split("@")[0] || "Judge Demo") || "Judge Demo";

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      name: fallbackName,
      wins: 0,
      totalBets: 0,
      onboarded: true,
    },
    { onConflict: "id" },
  );
  await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);

  const response = NextResponse.json({ ok: true, redirectTo: "/pool" });
  response.cookies.set(ONBOARDED_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
