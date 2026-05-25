"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAnonId } from "@/lib/anon-id";

export function ReviewForm({ spotId, onSubmitted }: { spotId: string; onSubmitted?: () => void }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const anon = getAnonId();
    const { error } = await supabase.rpc("add_review_and_update_rating", {
      s_id: spotId,
      anon: anon,
      r: rating,
      body: content,
    } as any);
    if (error) {
      console.error(error);
    } else {
      setContent("");
      setRating(5);
      onSubmitted?.();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="text-sm">評分</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2">
          {[5,4,3,2,1].map((v) => (
            <option key={v} value={v}>{v} 星</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm">評論</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full mt-1 p-2 rounded-md border" />
      </div>
      <div>
        <button type="submit" disabled={loading} className="rounded-full border px-4 py-2">
          {loading ? "送出中…" : "送出評論"}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
