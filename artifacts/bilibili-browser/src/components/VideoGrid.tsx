import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "./VideoCard";
import type { Video } from "@/data/videos";

interface VideoGridProps {
  videos: Video[];
  onRefresh: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

export function VideoGrid({ videos, onRefresh }: VideoGridProps) {
  return (
    <div className="relative pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={videos.map(v => v.id).join(',')}
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
