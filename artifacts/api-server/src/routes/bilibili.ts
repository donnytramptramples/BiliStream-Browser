import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const BILIBILI_POPULAR_URL =
  "https://api.bilibili.com/x/web-interface/popular?pn=1&ps=30";

const BILIBILI_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: "https://www.bilibili.com/",
  Origin: "https://www.bilibili.com",
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTimeAgo(pubdate: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - pubdate;
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} 个月前`;
  return `${Math.floor(diff / 31536000)} 年前`;
}

const CATEGORY_MAP: Record<string, string> = {
  动画: "Anime",
  游戏: "Gaming",
  音乐: "Music",
  科技: "Tech",
  生活: "Life",
  时尚: "Fashion",
  运动: "Sports",
  番剧: "Anime",
  国创: "Anime",
  影视: "Life",
  综艺: "Life",
  纪录片: "Life",
  知识: "Tech",
  美食: "Life",
  汽车: "Life",
  体育: "Sports",
};

function mapCategory(tname: string): string {
  return CATEGORY_MAP[tname] ?? "Recommended";
}

router.get("/popular", async (req: Request, res: Response) => {
  try {
    const response = await fetch(BILIBILI_POPULAR_URL, {
      headers: BILIBILI_HEADERS,
    });

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch from Bilibili" });
      return;
    }

    const json = (await response.json()) as {
      code: number;
      data: {
        list: Array<{
          bvid: string;
          title: string;
          pic: string;
          stat: { view: number; like: number };
          pubdate: number;
          owner: { name: string; face: string; mid: number };
          duration: number;
          tname: string;
          desc: string;
          short_link_v2?: string;
        }>;
      };
    };

    if (json.code !== 0) {
      res.status(502).json({ error: "Bilibili API error", code: json.code });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const videos = json.data.list.map((item) => ({
      id: item.bvid,
      bvid: item.bvid,
      title: item.title,
      thumbnail: `${baseUrl}/api/bilibili/image?url=${encodeURIComponent(item.pic)}`,
      duration: formatDuration(item.duration),
      views: item.stat.view,
      likes: item.stat.like,
      uploadedAt: formatTimeAgo(item.pubdate),
      category: mapCategory(item.tname),
      uploader: {
        name: item.owner.name,
        avatar: `${baseUrl}/api/bilibili/image?url=${encodeURIComponent(item.owner.face)}`,
        followers: 0,
      },
      videoUrl: `https://player.bilibili.com/player.html?bvid=${item.bvid}&autoplay=0&high_quality=1&danmaku=0`,
      description: item.desc || item.title,
    }));

    res.json({ videos });
  } catch (err) {
    req.log.error({ err }, "Failed to proxy Bilibili popular API");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/image", async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;

  if (!imageUrl || !imageUrl.startsWith("http")) {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }

  try {
    const response = await fetch(imageUrl, {
      headers: BILIBILI_HEADERS,
    });

    if (!response.ok) {
      res.status(502).send("Failed to fetch image");
      return;
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    req.log.error({ err }, "Failed to proxy image");
    res.status(500).send("Failed to proxy image");
  }
});

export default router;
