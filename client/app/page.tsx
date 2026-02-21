import Link from "next/link";
import { VegasHeader } from "@/components/vegas/header";
import { ItemCard } from "@/components/vegas/item-card";
import { mapRowToItem } from "@/lib/vegas-data";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: itemRows } = await supabase.from("items").select("*");
  const featuredItems = (itemRows ?? []).map((row) => mapRowToItem(row)).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100">
      <VegasHeader />

      <section
        className="relative overflow-hidden border-b border-white/10"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1491252706929-a72754910041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative mx-auto flex min-h-[26rem] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Vegas Community Swap
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Trade Smarter. Play Fair.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-200 sm:text-lg">
            List stuff you no longer need, enter fair-value pools, and win items you
            actually want.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/marketplace"
              className="rounded-lg bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200"
            >
              Browse Items
            </Link>
            <Link
              href="/pool"
              className="rounded-lg border border-zinc-500 bg-zinc-900 px-6 py-3 font-semibold text-white hover:border-zinc-300"
            >
              Start Gambling
            </Link>
            <Link
              href="/info"
              className="rounded-lg border border-zinc-600 px-6 py-3 font-semibold text-zinc-200 hover:bg-white/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              title: "List Your Items",
              body: "Upload unwanted items from bikes to electronics.",
            }, {
              title: "Join a Value Pool",
              body: "Enter pools with items from the same price tier.",
            }, {
              title: "Spin To Win",
              body: "A random winner takes the pooled items.",
            }, {
              title: "Trade Safely",
              body: "Meet in a public location and verify before exchanging.",
            }].map((step, index) => (
              <article key={step.title} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
                <span className="text-sm font-semibold text-amber-300">0{index + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Featured Items</h2>
            <Link href="/marketplace" className="text-sm font-semibold text-amber-300 hover:text-amber-200">
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-center">
          <h3 className="text-2xl font-semibold text-white">Safe and Local</h3>
          <p className="mt-2 text-zinc-400">
            All transactions stay within the Las Vegas community. Meet in public
            places and verify items before exchange.
          </p>
        </div>
      </section>
    </div>
  );
}
