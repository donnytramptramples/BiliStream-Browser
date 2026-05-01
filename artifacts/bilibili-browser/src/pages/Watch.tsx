import { useEffect, useState, useMemo } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { ThumbsUp, Share2, Plus, MoreHorizontal } from "lucide-react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBilibiliVideos } from "@/hooks/useBilibiliVideos";
import { formatNumber, shuffleArray } from "@/lib/utils";
import NotFound from "./not-found";

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
            <p>加载中...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
            <div className="flex-1 w-full max-w-[1000px] mx-auto lg:max-w-none">
              <div
                className="w-full bg-black rounded-xl overflow-hidden shadow-sm mb-4"
                style={{ aspectRatio: "16/9" }}
              >
                <iframe
                  src={video.videoUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  scrolling="no"
                  frameBorder="0"
                  title={video.title}
                  style={{ border: "none", display: "block" }}
                />
              </div>

              <h1 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                {video.title}
              </h1>

              <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
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
                    <h3 className="font-bold text-[15px]">
                      {video.uploader.name}
                    </h3>
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
                    <ThumbsUp
                      className="w-4 h-4"
                      fill={isLiked ? "currentColor" : "none"}
                    />
                    {formatNumber(video.likes + (isLiked ? 1 : 0))}
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2 shrink-0"
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4" />
                    分享
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2 shrink-0"
                    data-testid="button-save"
                  >
                    <Plus className="w-4 h-4" />
                    收藏
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shrink-0"
                    data-testid="button-more"
                  >
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
