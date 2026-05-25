"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SpotCard from "@/components/spot-card";
import { Spot } from "@/types/database";

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("spots").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error(error.message);
      } else if (mounted && data) {
        setSpots(data as Spot[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">校園美食地圖</h1>
      </header>

      <section aria-label="店家列表">
        {loading ? (
          <p>載入店家中…</p>
        ) : spots.length === 0 ? (
          <p>目前尚無店家。</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {spots.map((s) => (
              <SpotCard key={s.id} spot={s} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
