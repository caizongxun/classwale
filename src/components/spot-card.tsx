"use client";

import Link from "next/link";
import React from "react";
import { Spot } from "@/types/database";

export function SpotCard({ spot }: { spot: Spot }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <h3 className="text-lg font-medium">
        <Link href={`/spot/${spot.id}`}>{spot.name}</Link>
      </h3>
      <p className="text-sm text-muted-foreground mt-1">{spot.category}</p>
      <p className="mt-2 text-sm text-muted-foreground/80">
        {spot.description}
      </p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{spot.avg_rating ?? 0}</span>
          <span className="text-muted-foreground">⭐</span>
          <span className="text-muted-foreground">· {spot.review_count} 則評論</span>
        </div>
        <Link
          href={`/spot/${spot.id}`}
          className="rounded-full border px-3 py-1 text-sm"
        >
          查看
        </Link>
      </div>
    </article>
  );
}

export default SpotCard;
