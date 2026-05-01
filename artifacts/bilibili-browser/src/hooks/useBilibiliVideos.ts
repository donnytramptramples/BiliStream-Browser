import { useState, useEffect } from "react";
import type { Video } from "@/data/videos";

interface BilibiliResponse {
  videos: Video[];
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function useBilibiliVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`${BASE}/api/bilibili/popular`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<BilibiliResponse>;
      })
      .then((data) => {
        if (!cancelled) {
          setVideos(data.videos);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load videos");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { videos, isLoading, error, refetch: () => {} };
}
