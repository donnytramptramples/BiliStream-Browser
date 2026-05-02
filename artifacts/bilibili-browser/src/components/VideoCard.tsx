import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Play, Eye, Clock } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Video } from "@/data/videos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { preloadVideo } from "@/lib/videoPreloadCache";

interface VideoCardProps {
  video: Video;
  compact?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

export const VideoCard = React.memo(function VideoCard({ video, compact = false }: VideoCardProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const preloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  // Start preloading after 200ms hover — avoids wasted calls on fast mouse sweeps
  const handleMouseEnter = useCallback(() => {
    preloadTimer.current = setTimeout(() => {
      preloadVideo(video.bvid);
    }, 200);
  }, [video.bvid]);

  const handleMouseLeave = useCallback(() => {
    if (preloadTimer.current) {
      clearTimeout(preloadTimer.current);
      preloadTimer.current = null;
    }
  }, []);

  if (compact) {
    return (
      <Link
        href={`/watch/${video.id}`}
        className="group flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-video w-40 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {isIntersecting ? (
            <img
              ref={imgRef}
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div ref={imgRef} className="w-full h-full" />
          )}
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium tracking-wide">
            {video.duration}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Play
              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity"
              fill="currentColor"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0 py-1">
          <h3 className="font-medium text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate hover:text-foreground transition-colors">
            {video.uploader.name}
          </p>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5 gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.uploadedAt}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/watch/${video.id}`}
        className="group block h-full rounded-xl hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted mb-3 shadow-sm group-hover:shadow-md transition-shadow">
          {isIntersecting ? (
            <img
              ref={imgRef}
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div ref={imgRef} className="w-full h-full" />
          )}

          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded shadow-sm font-medium tracking-wide">
            {video.duration}
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Play
              className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transition-all scale-75 group-hover:scale-100"
              fill="currentColor"
            />
          </div>
        </div>

        <div className="flex gap-3 px-1">
          <Avatar className="w-9 h-9 border border-border/50 shrink-0 mt-0.5">
            <AvatarImage src={video.uploader.avatar} />
            <AvatarFallback>{video.uploader.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {video.title}
            </h3>

            <p className="text-sm text-muted-foreground truncate hover:text-foreground transition-colors cursor-pointer mb-0.5">
              {video.uploader.name}
            </p>

            <div className="flex items-center text-sm text-muted-foreground gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(video.views)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {video.uploadedAt}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
