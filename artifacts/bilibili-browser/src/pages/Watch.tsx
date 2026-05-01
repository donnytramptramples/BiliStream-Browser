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
import { useBilibiliPlay, QUALITY_LABEL } from "@/hooks/useBilibiliPlay";
import { formatNumber, shuffleArray } from "@/lib/utils";
import NotFound from "./not-found";

function VideoPlayer({ bvid }: { bvid: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { playInfo, isLoading, error } = useBilibiliPlay(bvid);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [playInfo?.streamUrl]);

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-white/60 text-sm">正在加载视频...</p>
      </div>
    );
  }

  if (error || videoError) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-white/70 text-sm text-center max-w-xs">
          {error || videoError}
        </p>
        <p className="text-white/40 text-xs">部分视频因地区限制无法播放</p>
      </div>
    );
  }

  if (!playInfo) return null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={playInfo.streamUrl}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="w-full h-full"
        onError={() => setVideoError("视频加载失败，可能因版权或地区限制")}
        crossOrigin="anonymous"
        data-testid="video-player"
      />
      <div className="absolute top-3 right-3 flex gap-1.5 pointer-events-none">
        <Badge
          className="text-[11px] px-2 py-0.5 font-semibold shadow"
          style={{ background: "#FB7299", color: "#fff" }}
        >
          {QUALITY_LABEL[playInfo.quality] ?? `${playInfo.quality}P`}
        </Badge>
      </div>
    </div>
  );
}

export default function Watch() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { videos } = useBilibiliVideos();

  const video = useMemo(() => videos.find((v) => v.id === id), [id, videos]);
  const relatedVideos = useMemo(
    () => shuffleArray(videos.filter((v) => v.id !== id)).slice(0, 10),
    [id, videos]
  );

  useEffect(() => {
    setIsLiked(false);
    setIsSubscribed(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (videos.length > 0 && !video) return <NotFound />;

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
        {!video ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <p>加载中...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
            <div className="flex-1 w-full max-w-[1000px] mx-auto lg:max-w-none">

              <VideoPlayer bvid={video.bvid} />

              <h1 className="text-xl md:text-2xl font-bold mt-4 mb-2 leading-tight">
                {video.title}
              </h1>

              <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4 flex-wrap">
                <span>{formatNumber(video.views)} 次观看</span>
                <span>{video.uploadedAt}</span>
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
                      !isSubscribed
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    data-testid="button-subscribe"
                  >
                    {isSubscribed ? "已关注" : "+ 关注"}
                  </Button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <Button
                    variant={isLiked ? "default" : "secondary"}
                    className={`rounded-full gap-2 shrink-0 ${
                      isLiked
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }`}
                    onClick={() => setIsLiked(!isLiked)}
                    data-testid="button-like"
                  >
                    <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                    {formatNumber(video.likes + (isLiked ? 1 : 0))}
                  </Button>
                  <Button variant="secondary" className="rounded-full gap-2 shrink-0">
                    <Share2 className="w-4 h-4" />
                    分享
                  </Button>
                  <Button variant="secondary" className="rounded-full gap-2 shrink-0">
                    <Plus className="w-4 h-4" />
                    收藏
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
        )}
      </main>
    </motion.div>
  );
}
