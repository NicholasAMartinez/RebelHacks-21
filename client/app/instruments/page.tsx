// @Author: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
// @Purpose: Example of fetching data from Supabase in a Next.js page using Suspense

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { VegasHeader } from "@/components/vegas/header";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();

  return (
    <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-xs text-zinc-200">
      {JSON.stringify(instruments, null, 2)}
    </pre>
  );
}

export default function Instruments() {
  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100">
      <VegasHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-4 text-3xl font-bold text-white">Instruments (Raw Data)</h1>
        <Suspense fallback={<div className="text-zinc-400">Loading instruments...</div>}>
          <InstrumentsData />
        </Suspense>
      </main>
    </div>
  );
}
