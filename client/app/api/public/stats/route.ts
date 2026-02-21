import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

type CountResult = {
  count: number;
  error: string | null;
};

async function getCount(
  query: PromiseLike<{ count: number | null; error: { message: string } | null }>,
): Promise<CountResult> {
  const result = await query;
  return {
    count: result.count ?? 0,
    error: result.error?.message ?? null,
  };
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        ok: true,
        estimated: true,
        stats: {
          activeListings: 0,
          completedTrades: 0,
          openTrades: 0,
          activeMembers: 0,
        },
      },
      { status: 200 },
    );
  }

  const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const [itemsCount, completedTradesCount, openTradesCount, membersCount] = await Promise.all([
    getCount(admin.from("items").select("*", { head: true, count: "exact" })),
    getCount(
      admin
        .from("trade_requests")
        .select("*", { head: true, count: "exact" })
        .eq("status", "completed"),
    ),
    getCount(
      admin
        .from("trade_requests")
        .select("*", { head: true, count: "exact" })
        .in("status", ["pending", "accepted"]),
    ),
    getCount(admin.from("profiles").select("*", { head: true, count: "exact" })),
  ]);

  const hasError = Boolean(
    itemsCount.error || completedTradesCount.error || openTradesCount.error || membersCount.error,
  );

  return NextResponse.json(
    {
      ok: true,
      estimated: hasError,
      stats: {
        activeListings: itemsCount.count,
        completedTrades: completedTradesCount.count,
        openTrades: openTradesCount.count,
        activeMembers: membersCount.count,
      },
      lastUpdated: new Date().toISOString(),
    },
    { status: 200 },
  );
}
