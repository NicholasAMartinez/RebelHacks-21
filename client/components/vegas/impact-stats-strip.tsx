"use client";

import { useEffect, useState } from "react";

type PublicStatsResponse = {
  ok?: boolean;
  estimated?: boolean;
  stats?: {
    activeListings?: number;
    completedTrades?: number;
    openTrades?: number;
    activeMembers?: number;
  };
};

const initialStats = {
  activeListings: 0,
  completedTrades: 0,
  openTrades: 0,
  activeMembers: 0,
};

export function ImpactStatsStrip() {
  const [stats, setStats] = useState(initialStats);
  const [isEstimated, setIsEstimated] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const response = await fetch("/api/public/stats", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as PublicStatsResponse;
        if (!active || !response.ok || !payload.ok || !payload.stats) return;
        setStats({
          activeListings: Number(payload.stats.activeListings || 0),
          completedTrades: Number(payload.stats.completedTrades || 0),
          openTrades: Number(payload.stats.openTrades || 0),
          activeMembers: Number(payload.stats.activeMembers || 0),
        });
        setIsEstimated(Boolean(payload.estimated));
      } catch {
        // Keep default values when stats fetch fails.
      }
    };

    void loadStats();
    return () => {
      active = false;
    };
  }, []);

  const tiles = [
    { label: "Active Listings", value: stats.activeListings },
    { label: "Completed Trades", value: stats.completedTrades },
    { label: "Open Trade Tickets", value: stats.openTrades },
    { label: "Active Members", value: stats.activeMembers },
  ];

  return (
    <section className="border-y border-white/10 bg-black/30 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Impact Snapshot</p>
          {isEstimated ? <p className="text-xs text-zinc-400">Live metrics may be delayed</p> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <article key={tile.label} className="rounded-lg border border-zinc-700/80 bg-zinc-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{tile.label}</p>
              <p className="mt-2 text-2xl font-black text-amber-200">{tile.value.toLocaleString()}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
