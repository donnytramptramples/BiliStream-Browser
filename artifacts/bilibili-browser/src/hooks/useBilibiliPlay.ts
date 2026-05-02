import { useState, useEffect } from "react";
import { getPreloaded, preloadVideo, type PreloadedVideoData } from "@/lib/videoPreloadCache";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export type PlayInfo = PreloadedVideoData & {
  acceptQuality: number[];
  acceptDescription: string[];
};

const QUALITY_LABEL: Record<number, string> = {
  116: "1080P60",
  80: "1080P",
  64: "720P",
  32: "480P",
  16: "360P",
};

export { QUALITY_LABEL };

function toPlayInfo(data: PreloadedVideoData): PlayInfo {
  return {
    ...data,
    acceptQuality: data.accept_quality,
    acceptDescription: data.accept_description,
  };
}

export function useBilibiliPlay(bvid: string) {
  const [playInfo, setPlayInfo] = useState<PlayInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bvid) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setPlayInfo(null);

    (async () => {
      try {
        // Check preload cache first — may already be resolved (instant) or in-flight
        const cached = await getPreloaded(bvid);
        if (cached) {
          if (!cancelled) {
            setPlayInfo(toPlayInfo(cached));
            setIsLoading(false);
          }
          return;
        }

        // Cache miss — fetch directly
        const r = await fetch(`${BASE}/api/bilibili/video/${bvid}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as PreloadedVideoData & { error?: string };
        if (data.error) throw new Error(data.error);

        if (!cancelled) {
          setPlayInfo(toPlayInfo(data));
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load video");
          setIsLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [bvid]);

  return { playInfo, isLoading, error };
}

// Kick off a background preload — call this from VideoCard on hover
export { preloadVideo };
