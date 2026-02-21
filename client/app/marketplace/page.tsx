"use client";

import { useEffect, useMemo, useState } from "react";
import { VegasHeader } from "@/components/vegas/header";
import { ItemCard } from "@/components/vegas/item-card";
import { categories, mapRowToItem, type Item } from "@/lib/vegas-data";
import { createClient } from "@/lib/supabase/client";

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");

  useEffect(() => {
    const supabase = createClient();

    const loadItems = async () => {
      const { data, error } = await supabase.from("items").select("*");
      if (error) {
        setItems([]);
        setIsLoading(false);
        return;
      }
      setItems((data ?? []).map((row) => mapRowToItem(row)));
      setIsLoading(false);
    };

    void loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className="page-shell">
      <VegasHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 text-4xl font-bold text-amber-200">Marketplace</h1>
        <p className="mb-8 text-zinc-400">
          Browse community items and add eligible picks to your pool.
        </p>

        <div className="mb-8 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-slate-950 py-3 px-4 text-white outline-none focus:border-amber-300"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-400">Filter:</span>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  selectedCategory === category
                    ? "bg-amber-300 text-black"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-lg text-zinc-400">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <p className="py-16 text-center text-lg text-zinc-400">
            No items found matching your criteria.
          </p>
        ) : (
          <>
            <p className="mb-6 text-zinc-400">
              Showing {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
