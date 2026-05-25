"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Review } from "@/types/database";

export function ReviewList({ spotId }: { spotId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("spot_id", spotId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      } else if (mounted && data) {
        setReviews(data as Review[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [spotId]);

  if (loading) return <p>載入評論…</p>;
  if (reviews.length === 0) return <p>還沒有人評論過，快來留下第一則！</p>;

  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-md border p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">{r.anon_id}</div>
            <div className="font-semibold">{r.rating} ⭐</div>
          </div>
          <p className="mt-2 text-sm">{r.content}</p>
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
