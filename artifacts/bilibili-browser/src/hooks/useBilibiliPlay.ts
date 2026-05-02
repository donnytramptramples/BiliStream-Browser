import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface PlayInfo {
  rawUrl: string;
  proxyUrl: string;
  quality: number;
  acceptQuality: number[];
  acceptDescription: string[];
  cid: number;
  title: string;
  pic: string;
  views: number;
  likes: number;
  owner: { name: string; face: string };
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

    fetch(`${BASE}/api/bilibili/video/${bvid}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{
          cid: number;
          title: string;
          pic: string;
          views: number;
          likes: number;
          owner: { name: string; face: string };
          rawUrl: string;
          proxyUrl: string;
          quality: number;
          accept_quality: number[];
          accept_description: string[];
          error?: string;
        }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setPlayInfo({
          rawUrl: data.rawUrl,
          proxyUrl: data.proxyUrl,
          quality: data.quality,
          acceptQuality: data.accept_quality,
          acceptDescription: data.accept_description,
          cid: data.cid,
          title: data.title,
          pic: data.pic,
          views: data.views,
          likes: data.likes,
          owner: data.owner,
        });
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load video");
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [bvid]);

  return { playInfo, isLoading, error };
}
