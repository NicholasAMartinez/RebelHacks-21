import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AuthMode = "login" | "register";

type AuthRequestBody = {
  mode?: AuthMode;
  email?: string;
  password?: string;
  username?: string;
};

function deriveUsername(email: string) {
  return email.split("@")[0]?.trim().slice(0, 32) || "player";
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = (await req.json().catch(() => null)) as AuthRequestBody | null;

  // Debug: log a masked representation of the incoming body and content-type
  try {
    const contentType = req.headers.get("content-type");
    const safeBody = body
      ? {
          ...body,
          password: body.password ? "[REDACTED]" : undefined,
        }
      : null;
    // Use console.debug so this is easy to find in dev logs
    console.debug("[auth] Incoming request", { contentType, body: safeBody });
  } catch (e) {
    // ignore logging errors
  }

  if (!body?.mode || !body.email || !body.password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (body.mode !== "login" && body.mode !== "register") {
    return NextResponse.json({ error: "Invalid auth mode." }, { status: 400 });
  }

  if (body.password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  if (body.mode === "register" && body.username && body.username.trim().length < 3) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters." },
      { status: 400 },
    );
  }

  if (body.mode === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const user = data.user;
    if (user) {
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: deriveUsername(body.email),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id", ignoreDuplicates: true },
      );
    }

    return NextResponse.json({ ok: true, message: "Logged in.", redirectTo: "/profile" });
  }

  const username = body.username?.trim() || deriveUsername(body.email);
  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // If email confirmation is disabled, a session exists immediately and we can safely write profile now.
  if (data.user && data.session) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        username,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    return NextResponse.json({
      ok: true,
      message: "Account created.",
      redirectTo: "/profile",
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Check your email to confirm registration.",
    redirectTo: "/login",
  });
}

export async function DELETE() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Signed out." });
}
