import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface PlayInfo {
  streamUrl: string;
  quality: number;
  acceptQuality: number[];
  acceptDescription: string[];
  cid: number;
}

const QUALITY_LABEL: Record<number, string> = {
  116: "1080P60",
  80: "1080P",
  64: "720P",
  32: "480P",
  16: "360P",
};

export { QUALITY_LABEL };

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
        const infoRes = await fetch(`${BASE}/api/bilibili/videoinfo/${bvid}`);
        if (!infoRes.ok) throw new Error("Video info fetch failed");
        const info = (await infoRes.json()) as { cid: number };

        const playRes = await fetch(
          `${BASE}/api/bilibili/playurl?bvid=${bvid}&cid=${info.cid}`
        );
        if (!playRes.ok) throw new Error("Stream URL fetch failed");
        const play = (await playRes.json()) as {
          url: string;
          quality: number;
          accept_quality: number[];
          accept_description: string[];
          error?: string;
        };

        if (play.error) throw new Error(play.error);

        if (!cancelled) {
          setPlayInfo({
            streamUrl: play.url,
            quality: play.quality,
            acceptQuality: play.accept_quality,
            acceptDescription: play.accept_description,
            cid: info.cid,
          });
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
