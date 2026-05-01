import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "./VideoCard";
import type { Video } from "@/data/videos";

interface VideoGridProps {
  videos: Video[];
  onRefresh: () => void;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex gap-3 px-1">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function VideoGrid({ videos, onRefresh, isLoading = false }: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="relative pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={videos.map((v) => v.id).join(",")}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </motion.div>
      </AnimatePresence>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg shadow-primary/20 hover:scale-105 transition-transform z-40 bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onRefresh}
        data-testid="button-refresh-feed"
      >
        <RefreshCw className="w-5 h-5" />
      </Button>
    </div>
  );
}
