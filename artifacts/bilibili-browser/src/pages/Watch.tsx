import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { ThumbsUp, Share2, Plus, MoreHorizontal, Loader2, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useBilibiliVideos } from "@/hooks/useBilibiliVideos";
import { type PlayInfo, useBilibiliPlay, QUALITY_LABEL } from "@/hooks/useBilibiliPlay";
import { formatNumber, shuffleArray } from "@/lib/utils";
import type { Video } from "@/data/videos";

interface VideoPlayerProps {
  bvid: string;
  playInfo: PlayInfo | null;
  isLoading: boolean;
  error: string | null;
}

function VideoPlayer({ bvid, playInfo, isLoading, error }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usedProxy, setUsedProxy] = useState(false);
  const [hardFail, setHardFail] = useState(false);

  useEffect(() => {
    setUsedProxy(false);
    setHardFail(false);
  }, [bvid]);

  const activeSrc = useMemo(() => {
    if (!playInfo) return null;
    return usedProxy ? playInfo.proxyUrl : playInfo.rawUrl;
  }, [playInfo, usedProxy]);

  useEffect(() => {
    if (videoRef.current && activeSrc) videoRef.current.load();
  }, [activeSrc]);

  function handleError() {
    if (!usedProxy) setUsedProxy(true);
    else setHardFail(true);
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-white/60 text-sm">正在加载视频...</p>
      </div>
    );
  }

  if (error || hardFail) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl flex flex-col items-center justify-center gap-4 px-6">
        <AlertCircle className="w-12 h-12 text-[#FB7299]" />
        <div className="text-center">
          <p className="text-white/80 text-base font-medium mb-1">无法播放此视频</p>
          <p className="text-white/50 text-sm">该视频可能因版权或地区限制无法播放</p>
        </div>
        <a
          href={`https://www.bilibili.com/video/${bvid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 px-5 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: "#FB7299" }}
        >
          在 Bilibili 上观看
        </a>
      </div>
    );
  }

  if (!activeSrc) return null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={activeSrc}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="w-full h-full"
        onError={handleError}
      />
      {playInfo && (
        <div className="absolute top-3 right-3 pointer-events-none">
          <Badge
            className="text-[11px] px-2 py-0.5 font-semibold shadow"
            style={{ background: "#FB7299", color: "#fff" }}
          >
            {QUALITY_LABEL[playInfo.quality] ?? `${playInfo.quality}P`}
          </Badge>
        </div>
      )}
    </div>
  );
}

export default function Watch() {
  const { id } = useParams();
  const bvid = id ?? "";
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Single fetch — shared by player and metadata
  const { playInfo, isLoading: playLoading, error: playError } = useBilibiliPlay(bvid);
  const { videos: feedVideos } = useBilibiliVideos();

  const feedVideo = useMemo(
    () => feedVideos.find((v) => v.id === bvid) ?? null,
    [feedVideos, bvid]
  );

  const relatedVideos = useMemo(
    () => shuffleArray(feedVideos.filter((v) => v.id !== bvid)).slice(0, 10),
    [feedVideos, bvid]
  );

  // Derive display metadata from playInfo (fastest) or fall back to feed
  const video: Video | null = useMemo(() => {
    if (feedVideo) return feedVideo;
    if (!playInfo) return null;
    return {
      id: bvid,
      bvid,
      title: playInfo.title,
      thumbnail: `/api/bilibili/image?url=${encodeURIComponent(playInfo.pic)}`,
      duration: "",
      views: playInfo.views,
      likes: playInfo.likes,
      uploadedAt: "",
      category: "Recommended",
      uploader: {
        name: playInfo.owner.name,
        avatar: `/api/bilibili/image?url=${encodeURIComponent(playInfo.owner.face)}`,
        followers: 0,
      },
      videoUrl: "",
      description: "",
    };
  }, [feedVideo, playInfo, bvid]);

  useEffect(() => {
    setIsLiked(false);
    setIsSubscribed(false);
    window.scrollTo(0, 0);
  }, [bvid]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          <div className="flex-1 w-full max-w-[1000px] mx-auto lg:max-w-none">

            {/* Player receives pre-fetched data — no duplicate API call */}
            <VideoPlayer
              bvid={bvid}
              playInfo={playInfo}
              isLoading={playLoading}
              error={playError}
            />

            {/* Metadata — appears as soon as playInfo resolves */}
            {playLoading && !video ? (
              <div className="mt-4 space-y-3 animate-pulse">
                <div className="h-7 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-10 bg-muted rounded w-1/2 mt-2" />
              </div>
            ) : video ? (
              <>
                <h1 className="text-xl md:text-2xl font-bold mt-4 mb-2 leading-tight">
                  {video.title}
                </h1>

                <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4 flex-wrap">
                  <span>{formatNumber(video.views)} 次观看</span>
                  {video.uploadedAt && <span>{video.uploadedAt}</span>}
                  <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">
                    {video.category}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-border">
                      <AvatarImage src={video.uploader.avatar} />
                      <AvatarFallback>{video.uploader.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-[15px]">{video.uploader.name}</h3>
                      {video.uploader.followers > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(video.uploader.followers)} 粉丝
                        </p>
                      )}
                    </div>
                    <Button
                      variant={isSubscribed ? "secondary" : "default"}
                      className={`ml-2 rounded-full px-6 transition-colors ${
                        !isSubscribed ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""
                      }`}
                      onClick={() => setIsSubscribed(!isSubscribed)}
                    >
                      {isSubscribed ? "已关注" : "+ 关注"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    <Button
                      variant={isLiked ? "default" : "secondary"}
                      className={`rounded-full gap-2 shrink-0 ${
                        isLiked ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                      }`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                      {formatNumber(video.likes + (isLiked ? 1 : 0))}
                    </Button>
                    <Button variant="secondary" className="rounded-full gap-2 shrink-0">
                      <Share2 className="w-4 h-4" />分享
                    </Button>
                    <Button variant="secondary" className="rounded-full gap-2 shrink-0">
                      <Plus className="w-4 h-4" />收藏
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {video.description && (
                  <div className="bg-muted/30 p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed border border-border/50">
                    {video.description}
                  </div>
                )}
              </>
            ) : null}
          </div>

          <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0">
            <h3 className="font-bold text-lg mb-4">相关推荐</h3>
            <div className="flex flex-col gap-3">
              {relatedVideos.map((v) => (
                <VideoCard key={v.id} video={v} compact />
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
