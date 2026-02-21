// @Author: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
// @Purpose: Example of fetching data from Supabase in a Next.js page using Suspense

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function ItemsData() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("items").select();

  return <pre>{JSON.stringify(items, null, 2)}</pre>;
}

export default function items() {
  return (
    <Suspense fallback={<div>Loading items...</div>}>
      <ItemsData />
    </Suspense>
  );
}
