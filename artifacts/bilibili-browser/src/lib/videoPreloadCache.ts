const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface PreloadedVideoData {
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
}

// bvid → resolved data or in-flight Promise
const cache = new Map<string, PreloadedVideoData | Promise<PreloadedVideoData>>();

export function preloadVideo(bvid: string): void {
  if (!bvid || cache.has(bvid)) return;

  const promise = fetch(`${BASE}/api/bilibili/video/${bvid}`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<PreloadedVideoData & { error?: string }>;
    })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      // Upgrade the cache entry from Promise → data
      cache.set(bvid, data);
      return data;
    })
    .catch(() => {
      // On error, remove so a real click can retry
      cache.delete(bvid);
      throw new Error("preload failed");
    });

  cache.set(bvid, promise);
}

export async function getPreloaded(bvid: string): Promise<PreloadedVideoData | null> {
  const entry = cache.get(bvid);
  if (!entry) return null;
  try {
    // Works for both resolved data and in-flight Promise
    return await Promise.resolve(entry);
  } catch {
    return null;
  }
}

export function getCachedSync(bvid: string): PreloadedVideoData | null {
  const entry = cache.get(bvid);
  if (entry && !(entry instanceof Promise)) return entry;
  return null;
}
