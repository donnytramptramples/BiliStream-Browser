import { useState, useEffect } from "react";
import type { Video } from "@/data/videos";

interface BilibiliResponse {
  videos: Video[];
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function useBilibiliVideos(category = "All") {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setVideos([]);

    const url =
      category === "All" || category === "Recommended"
        ? `${BASE}/api/bilibili/popular`
        : `${BASE}/api/bilibili/category?name=${encodeURIComponent(category)}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<BilibiliResponse>;
      })
      .then((data) => {
        if (!cancelled) {
          setVideos(data.videos ?? []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load videos");
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [category]);

  return { videos, isLoading, error };
}
