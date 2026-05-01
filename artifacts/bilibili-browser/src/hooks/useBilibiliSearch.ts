import { useState, useEffect } from "react";
import type { Video } from "@/data/videos";

interface SearchResponse {
  videos: Video[];
  total: number;
  pages: number;
  page: number;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function useBilibiliSearch(query: string, page = 1) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setVideos([]);
      setTotal(0);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const url = `${BASE}/api/bilibili/search?q=${encodeURIComponent(query)}&page=${page}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SearchResponse>;
      })
      .then((data) => {
        if (!cancelled) {
          setVideos(data.videos);
          setTotal(data.total);
          setPages(data.pages);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Search failed");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, page]);

  return { videos, total, pages, isLoading, error };
}
