"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReviewList from "@/components/review-list";
import ReviewForm from "@/components/review-form";
import { Spot } from "@/types/database";

export default function SpotPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("spots").select("*").eq("id", id).single();
      if (error) {
        console.error(error);
        router.push("/");
      } else if (mounted) {
        setSpot(data as Spot);
      }
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  if (loading) return <p>載入中…</p>;
  if (!spot) return <p>找不到該店家</p>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{spot.name}</h1>
      <p className="text-sm text-muted-foreground">{spot.category} · {spot.address}</p>
      <p className="mt-4">{spot.description}</p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">評論</h2>
        <div className="mt-3">
          <ReviewForm spotId={spot.id} onSubmitted={() => {
            // 簡單 refresh: reload page
            router.refresh();
          }} />
        </div>
        <div className="mt-4">
          <ReviewList spotId={spot.id} />
        </div>
      </section>
    </main>
  );
}
